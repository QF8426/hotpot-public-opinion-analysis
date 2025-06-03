// test_parseAll.js
const { parseAll } = require('./src/index');      // 或者 './src/parsers/index'，视你的入口位置而定
const scrapeWeibo    = require('./src/scrapers/weibo');
const scrapeBilibili = require('./src/scrapers/bilibili');
const scrapeDouyin   = require('./src/scrapers/douyin');

(async () => {
  const [weiboRaw, bilibiliRaw, douyinRaw] = await Promise.all([
    scrapeWeibo(),
    scrapeBilibili(),
    scrapeDouyin()
  ]);

  const parsed = parseAll([weiboRaw, bilibiliRaw, douyinRaw]);
  console.log(parsed.slice(0, 5)); // 看前 5 条
})();
