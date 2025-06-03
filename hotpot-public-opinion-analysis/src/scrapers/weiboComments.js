// src/scrapers/weiboComments.js

const puppeteer = require('puppeteer-core');
const { saveComments, connect } = require('../db');

// 简单睡眠函数
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @param {String} hotId          MongoDB 中热点文档的 _id（任意唯一字符串）
 * @param {String} postUrlOrMid   帖子详情页链接或纯数字 mid
 */
async function fetchWeiboComments(hotId, postUrlOrMid) {
  // 1. 组装移动端详情页 URL
  let url = postUrlOrMid;
  if (!/^https?:\/\//.test(postUrlOrMid)) {
    url = `https://m.weibo.cn/detail/${postUrlOrMid}`;
  }

  // 2. 启动 puppeteer-core，指定本地 Chrome 路径
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();

  // 3. 设置移动端 UA
  await page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) ' +
    'AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
  );

  // 4. 启用请求拦截，收集评论接口的 JSON 响应
  await page.setRequestInterception(true);
  const comments = [];
  page.on('request', req => req.continue());
  page.on('response', async res => {
    const rurl = res.url();
    if (/\/comments\/(show|hotflow)/.test(rurl)) {
      try {
        const json = await res.json();
        const rawData = json.data;
        let rawList = [];
        if (Array.isArray(rawData?.comments)) {
          rawList = rawData.comments;
        } else {
          const hot = Array.isArray(rawData?.hot_data) ? rawData.hot_data : [];
          const rec = Array.isArray(rawData?.data) ? rawData.data : [];
          rawList = hot.concat(rec);
        }
        rawList.forEach(c => {
          comments.push({
            hotspotId: hotId,
            commentId: String(c.id || c.comment_id || ''),
            text: c.text || c.text_raw || c.comment || '',
            user: c.user?.screen_name || c.user?.name || '',
            createdAt: new Date(c.created_at || c.createdAt || Date.now()),
            replies: c.comments_count || c.reply_count || 0,
            sentiment: null
          });
        });
      } catch {
        // 忽略 JSON 解析错误
      }
    }
  });

  // 5. 导航到详情页
  await page.goto(url, { waitUntil: 'networkidle2' });

  // 6. 在页面中执行点击“评论”Tab 的脚本
  try {
    await page.evaluate(() => {
      // 找到页面上第一个包含“评论”二字的可点击元素并触发 click
      const allDivs = Array.from(document.querySelectorAll('div'));
      for (const d of allDivs) {
        if (d.innerText.includes('评论')) {
          d.click();
          return;
        }
      }
      throw new Error('找不到包含“评论”的元素');
    });
  } catch (e) {
    console.warn('点击“评论”Tab 失败：', e.message);
  }

  // 7. 等待评论接口返回的 JSON 被拦截
  await sleep(2000);

  // 8. 关闭浏览器
  await browser.close();

  // 9. 写入数据库
  if (comments.length > 0) {
    await saveComments(comments);
    console.log(`✅ 拦截并写入 ${comments.length} 条微博评论（url=${url}）`);
  } else {
    console.log(`⚠️ 未抓取到微博评论（url=${url}）`);
  }
}

module.exports = fetchWeiboComments;

// ------------------------------------------------
// 如果直接用 `node weiboComments.js` 测试，请将以下代码取消注释并填写真实 mid
// ------------------------------------------------

if (require.main === module) {
  (async () => {
    try {
      await connect();
      const hotId = 'test-hotspot-id';
      const weiboId = '5172004617718773'; // 替换成公开可见且有评论的 mid
      await fetchWeiboComments(hotId, weiboId);
    } catch (err) {
      console.error('测试执行出错：', err);
    } finally {
      process.exit(0);
    }
  })();
}



