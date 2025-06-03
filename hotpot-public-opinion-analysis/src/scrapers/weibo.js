// src/scrapers/weibo.js
const axios = require('axios');
const { topN = 20 } = require('../../config/config.json');

// 非数值热度标签映射
const TAG_SCORE_MAP = {
  '正在热转': 1000,
  '讨论上升':  500
};

async function scrapeWeibo() {
  const resp = await axios.get('https://m.weibo.cn/api/container/getIndex', {
    params: {
      containerid: '106003type=25&t=3&disable_hot=1&filter_type=realtimehot'
    },
    headers: { 'User-Agent': 'Mozilla/5.0' },
    timeout: 5000
  });

  const data = resp.data.data;
  if (!data || !Array.isArray(data.cards)) return [];

  // 调试：打印所有 card_type
  console.log('DEBUG weibo card types:', data.cards.map(c => c.card_type));

  // 优先找 card_type 为 9，其次使用下标1，再下标0
  let hotCard = data.cards.find(c => c.card_type === 9) || data.cards[1] || data.cards[0];
  const group   = Array.isArray(hotCard.card_group) ? hotCard.card_group : [];

  const timestamp = new Date().toISOString();
  const list = group
    .filter(item => item.desc && !item.desc.includes('查看更多'))
    .slice(0, topN)
    .map((item, idx) => ({
      rank:      idx + 1,
      title:     item.desc,
      hotRaw:    parseInt(item.hot, 10) || 0,
      hotScore:  (parseInt(item.hot, 10) || 0) + (TAG_SCORE_MAP[item.desc_extr] || 0),
      hotStatus: parseInt(item.hot, 10) > 0 ? 'normal' : (item.desc_extr || 'normal'),
      source:    'weibo',
      timestamp,
      scheme:    item.scheme    // ← 新增：抓取跳转链接
    }));

    console.log('Weibo raw sample:', list[0]);   // ← 在这里打印第一条
    return list;
}

module.exports = scrapeWeibo;

// 自测入口
if (require.main === module) {
  (async () => {
    try {
      const list = await scrapeWeibo();
      console.log('📝 Weibo hot search:', list);
    } catch (err) {
      console.error('❌ Weibo scrape error:', err);
    }
  })();
}


