// src/scrapers/bilibiliComments.js
const axios = require('axios');
const { saveComments } = require('../db');

async function fetchBilibiliComments(hotId, bvId) {
  const comments = [];
  let page = 1;
  while (true) {
    const url = `https://api.bilibili.com/x/v2/reply?jsonp=jsonp&type=1&oid=${bvId}&pn=${page}&ps=20`;
    const { data: res } = await axios.get(url);
    const replies = res.data?.replies || [];
    if (replies.length === 0) break;
    for (const c of replies) {
      comments.push({
        hotspotId: hotId,
        commentId: String(c.rpid),
        text: c.content.message,
        user: c.member.uname,
        createdAt: new Date(c.ctime * 1000),
        replies: c.count || 0,
        sentiment: null
      });
    }
    page++;
    if (page > 5) break;
  }
  await saveComments(comments);
}

module.exports = fetchBilibiliComments;
