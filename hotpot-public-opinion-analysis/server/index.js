// server/index.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const config = require('../config/config.json');

const app = express();
app.use(express.json());

async function main() {
  // 连接数据库
  const client = new MongoClient(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db();

  // —— 1. 热点列表接口：返回最后一次抓取的最多 80 条记录
  app.get('/api/hotspots', async (req, res) => {
    try {
      const { platform } = req.query;
      const filter = platform && platform !== 'all' ? { source: platform } : {};
      const data = await db
        .collection('hotspots')
        .find(filter)
        .sort({ fetchedAt: -1 })
        .limit(80)
        .toArray();
      res.json(data);
    } catch (err) {
      console.error('列表接口错误：', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // —— 2. 热点详情接口：返回指定 _id 的完整文档
  app.get('/api/hotspots/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const doc = await db
        .collection('hotspots')
        .findOne({ _id: new ObjectId(id) });
      if (!doc) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.json(doc);
    } catch (err) {
      console.error('详情接口错误：', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // —— 3. 热点趋势接口：返回指定 _id 的历史热度 [{ time, heat }, …]
  app.get('/api/hotspots/:hot_id/trends', async (req, res) => {
    try {
      // 直接使用字符串形式的文档 _id
      const hotId = req.params.hot_id;
      const dataDir = path.join(__dirname, '../data');
      const files = fs
        .readdirSync(dataDir)
        .filter(f => f.endsWith('.json'));
      const trends = [];

      for (const file of files) {
        const list = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
        // 匹配备份 JSON 中的 _id 字段
        const hit = list.find(item => item._id === hotId);
        if (hit) {
          trends.push({
            time: path.basename(file, '.json'), // e.g. "all-2025-05-30-08-23"
            heat: hit.heat                       // 使用 heat 作为趋势值
          });
        }
      }

      // 按时间升序排序
      trends.sort((a, b) => new Date(a.time) - new Date(b.time));
      res.json(trends);
    } catch (err) {
      console.error('趋势接口错误：', err);
      res.status(500).json({ error: err.message });
    }
  });

  // 启动服务
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API 服务已启动，端口：${port}`));
}

main().catch(err => {
  console.error('启动服务失败：', err);
});







