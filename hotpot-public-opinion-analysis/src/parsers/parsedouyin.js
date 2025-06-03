/**
 * src/parsers/parsedouyin.js
 * 将抖音原始热搜数据解析为统一格式
 * @param {Array} rawData 抖音爬虫抓取的原始数组，
 *        每项形如 { rank, title, hotRaw, hotScore, source, timestamp }
 * @returns {Array} 统一格式数组 [{ source, title, heat, link, timestamp, rank }]
 */

module.exports = function parseDouyin(rawData) {
  if (!Array.isArray(rawData)) return [];

  return rawData.map(item => ({
    source:    item.source || 'douyin',
    title:     item.title  || '',
    heat:      item.hotScore != null ? item.hotScore : (item.hotRaw || 0),
    // 暂时使用抖音搜索页 URL 作为跳转链接，后续可根据需求调整
    link:      `https://www.douyin.com/search/${encodeURIComponent(item.title)}`,
    timestamp: new Date(item.timestamp).getTime(),
    rank:      item.rank || 0
  }));
};
