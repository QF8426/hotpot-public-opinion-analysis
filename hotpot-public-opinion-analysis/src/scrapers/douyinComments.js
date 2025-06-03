// src/scrapers/douyinComments.js
const puppeteer = require('puppeteer');
const { saveComments } = require('../db');

async function fetchDouyinComments(hotId, videoUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(videoUrl, { waitUntil: 'networkidle2' });
  // 滚动加载评论
  await page.evaluate(async () => {
    for (let i = 0; i < 5; i++) {
      window.scrollBy(0, window.innerHeight);
      await new Promise(r => setTimeout(r, 1000));
    }
  });
  const comments = await page.$$eval('.comment-item', nodes =>
    nodes.map(n => ({
      commentId: n.getAttribute('data-id'),
      text: n.querySelector('.comment-content').innerText.trim(),
      user: n.querySelector('.user-name').innerText.trim(),
      createdAt: n.querySelector('.comment-time').innerText.trim(),
      replies: parseInt(n.querySelector('.reply-count')?.innerText) || 0
    }))
  );
  await browser.close();

  const toSave = comments.map(c => ({
    hotspotId: hotId,
    ...c,
    sentiment: null
  }));
  await saveComments(toSave);
}

module.exports = fetchDouyinComments;
