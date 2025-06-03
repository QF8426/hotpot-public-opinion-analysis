/**
 * src/parsers/parsebilibili.js
 * 将 B 站爬虫输出的原始热搜数据解析为统一格式
 * @param {Array} rawData 爬虫抓取后的数组，每项形如：
 *        { rank, title, hotRaw, hotScore, source, timestamp, link }
 * @returns {Array} 统一格式数组 [{ source, title, heat, link, timestamp, rank }]
 */
module.exports = function parseBilibili(rawData) {
  if (!Array.isArray(rawData)) return [];

  return rawData.map(item => ({
    source:    item.source || 'bilibili',
    title:     item.title  || '',
    heat:      item.hotScore != null ? item.hotScore : (item.hotRaw || 0),
    link:      item.link    || '',
    // 爬虫里给的是 ISO 字符串，用 Date 对象确保后一致性
    timestamp: (() => {
      const t = item.timestamp;
      if (typeof t === 'string') return new Date(t).toISOString();
      if (t instanceof Date)     return t.toISOString();
      if (typeof t === 'number') return new Date(t).toISOString();
      return null;
    })(),
    rank:      item.rank  || 0
  }));
};

