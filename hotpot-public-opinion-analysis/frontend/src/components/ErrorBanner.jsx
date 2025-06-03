import React from 'react';

export default function ErrorBanner({ message }) {
  return (
    <div style={{
      padding: '1rem',
      margin: '1rem',
      border: '1px solid #f00',
      background: '#fee',
      color: '#900'
    }}>
      出错了：{message}
    </div>
  );
}
