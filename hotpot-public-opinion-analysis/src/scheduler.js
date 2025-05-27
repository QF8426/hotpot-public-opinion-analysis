const scrapeWeibo = require('./scrapers/weibo');

// 启动时先跑一次
(async () => {
  console.log('🚀 Initial scrape at', new Date().toISOString());
  try {
    const data = await scrapeWeibo();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Initial scrape error:', e.message);
  }
})();

// 然后再挂在 cron 调度
const cron = require('node-cron');
const { cron: cronExpr } = require('../config/config.json');

cron.schedule(cronExpr, async () => {
  console.log('🕒 Scheduled scrape at', new Date().toISOString());
  try {
    const data = await scrapeWeibo();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Scheduled scrape error:', e.message);
  }
});
