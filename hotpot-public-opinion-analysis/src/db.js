// src/db.js
const { MongoClient } = require('mongodb');
const { mongoUri }    = require('../config/config.json');

let client, db;

/**
 * 连接 MongoDB 并返回 db 实例，首次连接时创建索引
 */
async function connect() {
  if (!client) {
    client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    // 如果 URI 里带了 /hotsearch 就会自动在这个库里操作
    db = client.db();

    try {
      // 在 hotspots 集合上建索引
      await db.collection('hotspots').createIndex(
        { source: 1, rank: 1 },
        { unique: false, background: true }
      );
      console.log('✅ 索引 source_rank 创建完成');
    } catch (err) {
      console.log('⚠️ 索引创建跳过或已存在');
    }
  }
  return db;
}

/**
 * 将解析后的热搜列表写入 MongoDB
 * —— 在插入前先清空旧数据，保证集合里始终只有最新那批快照
 * @param {Array<Object>} list 解析后的数据列表
 */
async function saveTopics(list) {
  if (!Array.isArray(list) || list.length === 0) return;
  const database = await connect();
  const col = database.collection('hotspots');
  await col.deleteMany({});
  await col.insertMany(list);
  console.log(`✅ 已写入 ${list.length} 条最新热搜`);
}

/**
 * 将爬取的评论列表写入 MongoDB
 * @param {Array<Object>} list 评论数据列表
 */
async function saveComments(list) {
  if (!Array.isArray(list) || list.length === 0) return;
  const database = await connect();
  const col = database.collection('comments');
  await col.insertMany(list);
  console.log(`✅ 已写入 ${list.length} 条评论`);
}

module.exports = {
  connect,
  saveTopics,
  saveComments
};



