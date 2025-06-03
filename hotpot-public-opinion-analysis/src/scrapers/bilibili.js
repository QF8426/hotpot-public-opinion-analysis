// src/scrapers/bilibili.js
const axios = require('axios');
const { topN = 20 } = require('../../config/config.json');

/**
 * 抓取 B站搜索热词（热搜榜）
 */
async function scrapeBilibiliHotword() {
  const URL = 'https://s.search.bilibili.com/main/hotword';
  const resp = await axios.get(URL, {
    headers: {
      Referer:     'https://www.bilibili.com/',
      'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                   'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                   'Chrome/114.0.0.0 Safari/537.36'
    },
    timeout: 5000
  });

  const body = resp.data;
  if (!body || body.code !== 0 || !Array.isArray(body.list)) return [];

  const now = new Date().toISOString();
  // 先截取原始数据，打印第一条，确认字段长啥样
  const raw = body.list.slice(0, topN);
  console.log('Bilibili raw sample:', raw[0]);

  // 然后再做原来的映射，并顺便生成一个搜索页 link
  const list = raw.map((item, idx) => ({
    rank:      idx + 1,
    title:     item.keyword || item.word || '',
    hotRaw:    Number(item.heat_score) || 0,
    hotScore:  Number(item.heat_score) || 0,
    source:    'bilibili',
    timestamp: now,
    // 如果接口本身没给链接，这里先用搜索页地址占位
    link:      `https://search.bilibili.com/all?keyword=${encodeURIComponent(item.keyword || item.word)}`
  }));
  console.log('Bilibili parsed sample:', list[0]);
  return list;
}

module.exports = scrapeBilibiliHotword;

// 自测入口
if (require.main === module) {
  (async () => {
    try {
      const list = await scrapeBilibiliHotword();
      console.log(list);
    } catch (err) {
      console.error(err);
    }
  })();
}



