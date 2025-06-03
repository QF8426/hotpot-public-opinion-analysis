import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHotspots } from '../api';
import HotspotCard from '../components/HotspotCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';

const PLATFORMS = [
  { label: '全部', value: 'all' },
  { label: '微博', value: 'weibo' },
  { label: 'B站', value: 'bilibili' },
  { label: '抖音', value: 'douyin' },
];

export default function HotspotsList() {
  const [rawData, setRawData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [platform, setPlatform] = useState('all');
  const [count, setCount] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchHotspots(platform)
      .then(res => {
        let list = res.data
          .filter(item => item.title && item.title.trim());
        const seen = new Set();
        list = list.filter(item => {
          if (seen.has(item.title)) return false;
          seen.add(item.title);
          return true;
        });
        list = list.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp).toISOString(),
        }));
        setRawData(list);
        setCount(20);
        setDisplayData(list.slice(0, 20));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [platform]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error} />;
  if (!rawData.length) return (
    <div style={{ padding: '1rem', fontSize: '1rem', color: '#666' }}>
      当前暂无数据
    </div>
  );

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="platform-select" style={{ marginRight: '0.5rem' }}>平台：</label>
        <select
          id="platform-select"
          value={platform}
          onChange={e => setPlatform(e.target.value)}
        >
          {PLATFORMS.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
      {displayData.map(item => (
        <HotspotCard
          key={item._id}
          topic={item}
          onClick={() => navigate(`/hotspots/${item._id}`)}
        />
      ))}
      {count < rawData.length && (
        <button
          style={{ margin: '1rem auto', display: 'block', padding: '0.5rem 1rem' }}
          onClick={() => {
            const next = count + 20;
            setDisplayData(rawData.slice(0, next));
            setCount(next);
          }}
        >
          加载更多
        </button>
      )}
    </div>
  );
}


