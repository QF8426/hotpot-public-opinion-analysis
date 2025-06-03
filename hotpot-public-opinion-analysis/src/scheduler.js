// src/scheduler.js

const cron = require('node-cron');
const fs   = require('fs');
const path = require('path');

const { connect, saveTopics } = require('./db');
const { parseAll } = require('./index');
const { cron: CRON_EXPR }       = require('../config/config.json');

// —— 确保 data 目录存在 ——
const DATA_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// —— 引入爬虫模块 ——
const scrapers = [
  require('./scrapers/weibo'),
  require('./scrapers/bilibili'),
  require('./scrapers/douyin'),
  // require('./scrapers/xiaohongshu'),
];

/**
 * 执行一次抓取—解析—存储流程
 */
async function job() {
  const timestamp = new Date().toISOString();
  console.log(`🕒 Aggregate scrape at ${timestamp}`);

  try {
    // 并行调用爬虫，单个失败不影响整体
    const settled = await Promise.allSettled(scrapers.map(fn => fn()));
    const raws    = settled
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    console.log(`✔ Scraped raw counts: [${raws.map(arr => arr.length).join(', ')}]`);

    // 解析标准化
    const parsed = parseAll(raws);
    console.log(`ℹ Parsed total items: ${parsed.length}`);

    // 连接数据库并去重写入
    await connect();
    await saveTopics(parsed);
    console.log('✅ Data written to MongoDB (via saveTopics)');

    // 本地 JSON 备份
    const filename = `all-${timestamp.slice(0,16).replace(/[:T]/g,'-')}.json`;
    const outfile  = path.join(DATA_DIR, filename);
    fs.writeFileSync(outfile, JSON.stringify(parsed, null, 2), 'utf8');
    console.log(`✅ Backup: ${filename}`);
  } catch (err) {
    console.error('❌ Aggregate job error:', err);
  }
}

// 启动时先跑一次
job();

// 按 cron 表达式定时执行
cron.schedule(CRON_EXPR, job);
