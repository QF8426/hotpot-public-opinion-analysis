import axios from 'axios';

/**
 * 拉取热点列表
 * @param {string} platform 'weibo'|'bilibili'|'douyin'|'all'
 * @param {number} [limit]  可选：返回条数，不传则返回所有
 */
export const fetchHotspots = (platform = 'all', limit) =>
  axios.get('/api/hotspots', { params: { platform, limit } });

/** 拉取单条热点详情 */
export const fetchHotspotDetail = (id) =>
  axios.get(`/api/hotspots/${id}`);
