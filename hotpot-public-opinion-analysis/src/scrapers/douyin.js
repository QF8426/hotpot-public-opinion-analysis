// src/scrapers/douyin.js
const axios = require('axios');
const { topN = 20 } = require('../../config/config.json');

async function scrapeDouyin() {
  const URL = 'https://aweme-hl.snssdk.com/aweme/v1/hot/search/list/';
  const resp = await axios.get(URL, {
    params: { detail_list: 1, cursor: 0 },
    headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile)' },
    timeout: 5000
  });

  const data = resp.data.data || {};
  // 确保 data.word_list 是数组
  const list = Array.isArray(data.word_list) ? data.word_list : [];

  const timestamp = new Date().toISOString();
  return list
    // 截取前 topN
    .slice(0, topN)
    // 标准化字段映射
    .map((item, idx) => {
      const raw = Number(item.hot_value) || Number(item.score) || 0;
      return {
        rank:      idx + 1,
        title:     item.word || item.keyword || '',
        hotRaw:    raw,
        hotScore:  raw,
        source:    'douyin',
        timestamp
      };
    });
}

module.exports = scrapeDouyin;

// 自测入口
if (require.main === module) {
  (async () => {
    try {
      const list = await scrapeDouyin();
      console.log('📝 Douyin hot search:', list);
    } catch (err) {
      console.error('❌ Douyin scrape error:', err);
    }
  })();
}

