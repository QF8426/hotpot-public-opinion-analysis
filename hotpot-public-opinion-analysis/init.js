#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// 要创建的目录列表
const dirs = [
  'src/scrapers',
  'config'
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// 要创建的文件及其初始内容
const files = [
  {
    path: 'config/config.json',
    content: JSON.stringify({
      platforms: ['weibo', 'bilibili', 'douyin', 'xiaohongshu'],
      cron: '*/10 * * * *'
    }, null, 2)
  },
  {
    path: 'src/scrapers/weibo.js',
    content: `const axios = require('axios');
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
`  },
  {
    path: 'src/scheduler.js',
    content: `const cron = require('node-cron');
const scrapeWeibo = require('./scrapers/weibo');

cron.schedule(process.env.CRON || require('../config/config.json').cron, async () => {
  console.log('Scraping at', new Date().toISOString());
  try {
    const data = await scrapeWeibo();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Scrape error:', err.message);
  }
});
`  },
  {
    path: 'package.json',
    content: `{
  "name": "hot-search-aggregator",
  "version": "1.0.0",
  "main": "src/scheduler.js",
  "scripts": {
    "init": "node init.js",
    "start": "node src/scheduler.js"
  },
  "dependencies": {
    "axios": "^0.27.2",
    "cheerio": "^1.0.0-rc.12",
    "node-cron": "^3.0.0"
  }
}`  }
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file.path);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, file.content);
    console.log(`Created file: ${file.path}`);
  }
});

console.log('Project initialized. Run `npm install` then `npm run start`.');
