# API 文档

| 接口名称     | 方法 | 路径                   | 请求参数                       | 返回示例                                  | 说明                     |
| ------------ | ---- | ---------------------- | ------------------------------ | ----------------------------------------- | ------------------------ |
| 获取热点列表 | GET  | /api/hotspots          | platform?, limit?              | [{ id, title, heat, platform, fetchedAt }] | 拉取聚合后的热点列表     |
| 话题详情     | GET  | /api/hotspots/:id      | id                             | { id, title, heat, platform, summary, comments: [] } | 返回单条热点详情        |
| 趋势数据     | GET  | /api/hotspots/:id/trend| fromDate?, toDate?             | [{ timestamp, heat }]                     | 返回话题热度随时间变化曲线 |
| 情感分析     | POST | /api/sentiment/analyze | comments: [string]             | [{ comment, sentiment: 'pos'|'neu'|'neg' }] | 分析一组评论情感倾向    |
| 生成报告     | POST | /api/report            | fromDate, toDate, format: 'pdf'| { reportUrl }                             | 按区间生成 PDF/Excel 报告 |
