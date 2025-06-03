/**
 * src/parsers/parseweibo.js
 * 将微博原始热搜数据解析为统一格式
 * @param {Array} rawData 微博爬虫抓取的原始数组，
 *        每项形如 { rank, title, hotRaw, hotScore, hotStatus, source, timestamp, scheme }
 * @returns {Array} 统一格式数组 [{ source, title, heat, link, timestamp, rank }]
 */

module.exports = function parseWeibo(rawData) {
  if (!Array.isArray(rawData)) return [];

  return rawData.map(item => ({
    source:    item.source || 'weibo',
    title:     item.title || '',                              // 微博热搜标题
    heat:      item.hotScore != null ? item.hotScore : item.hotRaw || 0,  // 优先使用 hotScore
    link:      item.scheme || '',                             // 跳转链接，若无则为空串
    timestamp: new Date(item.timestamp).getTime(),            // 将 ISO 时间字符串转为毫秒级时间戳
    rank:      item.rank || 0                                 // 排名
  }));
};

