// frontend/src/pages/HotspotDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';

export default function HotspotDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [trend, setTrend] = useState({ times: [], heats: [] });

  useEffect(() => {
    // 拉详情
    fetch(`/api/hotspots/${id}`)
      .then(res => res.json())
      .then(setDetail);

    // 拉趋势
    fetch(`/api/hotspots/${id}/trends`)
      .then(res => res.json())
      .then(data => {
        const times = data.map(item => item.time);
        const heats = data.map(item => item.heat);
        setTrend({ times, heats });
      });
  }, [id]);

  if (!detail) return <div>Loading…</div>;

  // ECharts 配置
  const option = {
    title: { text: '热度趋势' },
    tooltip: { trigger: 'axis' },
    grid: {
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '20%',    // 为了给斜着的标签留出足够空间
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: trend.times,
      axisLabel: {
        rotate: 45,
        margin: 10,     // 文字和轴线间距
        align: 'right'  // 让文字靠右对齐，更好看
      }
    },
    yAxis: {
      type: 'value',
      name: 'Heat'
    },
    series: [
      {
        name: '热度',
        type: 'line',
        data: trend.heats,
        smooth: true
      }
    ]
  };


  return (
    <div style={{ padding: 20 }}>
      {/* —————— 1. 标题 */}
      <h1 style={{ marginBottom: 12 }}>{detail.title}</h1>

      {/* —————— 2. 其他详情 */}
      <div style={{ marginBottom: 24, lineHeight: 1.6 }}>
        <p><strong>来源：</strong>{detail.source}</p>
        <p><strong>当前热度：</strong>{detail.heat}</p>
        <p>
          <strong>原文链接：</strong>
          <a href={detail.link} target="_blank" rel="noreferrer">
            点击查看
          </a>
        </p>
        {/* 根据需要继续补充其他字段 */}
      </div>

      {/* —————— 3. 趋势折线图（固定高度，不会挤压上面内容） */}
      <div style={{ height: 300, marginBottom: 40 }}>
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      {/* 后面还可以继续渲染评论区、情感分布图等 */}
    </div>
  );
}





