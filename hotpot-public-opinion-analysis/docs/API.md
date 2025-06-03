# API 文档

## 概述

本项目后端提供一组 HTTP 接口，供前端 React 应用获取热搜数据与执行相关分析。所有接口前缀均为 `/api`。

## 接口列表

### 1. 获取热搜列表

```
GET /api/hotspots?platform=<string>&limit=<number>
```

* **平台** (`platform` 可选)：`weibo` | `bilibili` | `douyin` | `all`，默认 `all`。
* **条数** (`limit` 可选)：返回记录数，默认后端配置的 topN（80）。

**响应示例**：

```json
[
  {
    "_id": "60f7c2e4b1a4c12d8f0e4d56",
    "title": "示例热搜关键词",
    "heat": 12345,
    "platform": "weibo",
    "timestamp": "2025-05-30T07:00:00.000Z",
    "aiSummary": "这是 AI 自动生成的摘要。"
  },
  /* 更多记录 */
]
```

### 2. 获取热搜详情

```
GET /api/hotspots/:id
```

* **路径参数**：`id`（必需），热搜记录的 `_id`。

**响应示例**：

```json
{
  "_id": "60f7c2e4b1a4c12d8f0e4d56",
  "title": "示例热搜关键词",
  "heat": 12345,
  "platform": "weibo",
  "timestamp": "2025-05-30T07:00:00.000Z",
  "aiSummary": "这是 AI 自动生成的摘要。",
  "comments": [
    { "text": "热评 A", "sentiment": "pos" },
    { "text": "热评 B", "sentiment": "neg" }
  ]
}
```

### 3. 获取热度趋势（预留 Feature）

```
GET /api/hotspots/:id/trends?fromDate=<ISO>&toDate=<ISO>
```

* **路径参数**：`id`。
* **查询参数**：

  * `fromDate` (可选)：ISO 日期字符串，默认最近 7 天。
  * `toDate`   (可选)：ISO 日期字符串，默认当前。

**响应示例**：

```json
[
  { "timestamp": "2025-05-23T07:00:00.000Z", "heat": 5432 },
  { "timestamp": "2025-05-24T07:00:00.000Z", "heat": 6789 }
  /* … */
]
```

### 4. 评论情感分析

```
POST /api/sentiment/analyze
```

**请求体**：

```json
{ "comments": ["这条评论很棒！", "一般般。"] }
```

**响应示例**：

```json
[
  { "comment": "这条评论很棒！", "sentiment": "pos" },
  { "comment": "一般般。", "sentiment": "neg" }
]
```

### 5. 报告生成（预留 Feature）

```
POST /api/report
```

**请求体**：

```json
{
  "fromDate": "2025-05-01T00:00:00.000Z",
  "toDate":   "2025-05-30T23:59:59.999Z",
  "format":   "pdf"    // 可选: "pdf" 或 "excel"
}
```

**响应示例**：

```json
{ "reportUrl": "http://localhost:5000/reports/2025-05-01_05-30.pdf" }
```

---

*注意：3、5 项暂未实现，后续会随着 Day06 功能迭代而补充。*
