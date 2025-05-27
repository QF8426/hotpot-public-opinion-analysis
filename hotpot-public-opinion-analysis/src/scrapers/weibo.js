const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeWeibo() {
  const resp = await axios.get('https://s.weibo.com/top/summary');
  const $ = cheerio.load(resp.data);
  const list = [];
  $('.list_a li a').slice(0, 20).each((i, el) => {
    const title = $(el).text().trim();
    list.push({ title, rank: i + 1, source: 'weibo' });
  });
  return list;
}

module.exports = scrapeWeibo;
