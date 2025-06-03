import React from 'react';

export default function HotspotCard({ topic, onClick }) {
  const date = new Date(topic.timestamp);
  const timeStr = isNaN(date.getTime())
    ? '—:—:—'
    : date.toLocaleTimeString();

  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '0.8rem',
        margin: '0.5rem 0',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <h3 style={{ margin: '0 0 0.5rem' }}>{topic.title}</h3>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#666', gap: '1rem' }}>
        <span role="img" aria-label="heat">🔥{topic.heat}</span>
        <span>· 平台：{topic.platform}</span>
        <span>· {timeStr}</span>
      </div>
    </div>
  );
}

