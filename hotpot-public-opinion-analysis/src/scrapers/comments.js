// src/scrapers/comments.js
const fetchWeiboComments    = require('./weiboComments');
const fetchBilibiliComments = require('./bilibiliComments');
const fetchDouyinComments   = require('./douyinComments');

async function fetchAllComments(topic) {
  const { _id: hotId, originalWeiboId, bvId, douyinUrl } = topic;
  // 并行抓取三家平台的评论（参数根据你存储的字段定）
  await Promise.all([
    originalWeiboId    && fetchWeiboComments(hotId, originalWeiboId),
    bvId               && fetchBilibiliComments(hotId, bvId),
    douyinUrl          && fetchDouyinComments(hotId, douyinUrl),
  ]);
}

module.exports = fetchAllComments;
