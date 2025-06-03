// testWeiboComments.js
const mongoose = require('mongodb'); // 确保引入
const fetchWeiboComments = require('./src/scrapers/weiboComments');
const { connect } = require('./src/db');

async function run() {
  try {
    // 1. 先保证 DB 已连上（和 scheduler 用同一个连接）
    await connect();
    // 2. 填入一个你想测试的热点 _id 和对应的微博 mid
    const hotId   = '68397fface997971849ad89e'; // 列表接口拿到的 _id
    const weiboId = '4690123456789012';         // 从 detail.link 或者原始 hot_id 字段里提取

    // 3. 调用爬虫
    await fetchWeiboComments(hotId, weiboId);

    console.log('微博评论爬取测试完毕');
  } catch (err) {
    console.error('微博爬虫出错：', err);
  } finally {
    process.exit(0);
  }
}

run();
