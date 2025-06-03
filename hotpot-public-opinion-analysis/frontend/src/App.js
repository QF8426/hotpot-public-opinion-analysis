// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HotspotsList from './pages/HotspotsList';
import HotspotDetail from './pages/HotspotDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/hotspots" replace />} />
        <Route path="/hotspots" element={<HotspotsList />} />
        <Route path="/hotspots/:id" element={<HotspotDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
