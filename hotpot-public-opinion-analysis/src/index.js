/**
 * src/index.js
 * 解析器模块统一入口
 * 
 * 本文件统一导入各平台具体解析函数，并导出单个平台解析和全量解析接口。
 */

const parseWeibo     = require('./parsers/parseweibo');
const parseBilibili  = require('./parsers/parsebilibili');
const parseDouyin    = require('./parsers/parsedouyin');

/**
 * 将各平台原始数据列表统一解析并合并输出
 * @param {Array[]} rawResults - 各平台爬虫输出的原始数组列表，顺序应与 scrapers 调用顺序一致
 * @returns {Array} 标准化后、合并的热搜数据列表
 */
function parseAll(rawResults) {
  // 解构各平台的原始数组，不给则默认为空数组
  const [weiboRaw = [], bilibiliRaw = [], douyinRaw = []] = rawResults;

  // 调用各解析函数并合并
  return [
    ...parseWeibo(weiboRaw),
    ...parseBilibili(bilibiliRaw),
    ...parseDouyin(douyinRaw)
  ];
}

module.exports = {
  parseWeibo,
  parseBilibili,
  parseDouyin,
  parseAll
};
