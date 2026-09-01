import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LandingPage } from '../pages/LandingPage';
import { UtilitiesHubPage } from '../pages/UtilitiesHubPage';
import { SplitPdfPage } from '../pages/SplitPdfPage';
import { JoinPdfPage } from '../pages/JoinPdfPage';
import { ReorderPdfPage } from '../pages/ReorderPdfPage';
import { ReducePdfPage } from '../pages/ReducePdfPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/utils" element={<UtilitiesHubPage />} />
        <Route path="/hub" element={<UtilitiesHubPage />} />
        <Route path="/split" element={<SplitPdfPage />} />
        <Route path="/merge" element={<JoinPdfPage />} />
        <Route path="/join" element={<JoinPdfPage />} />
        <Route path="/reorder" element={<ReorderPdfPage />} />
        <Route path="/reduce" element={<ReducePdfPage />} />
        <Route path="/compress" element={<ReducePdfPage />} />
        <Route path="*" element={<Navigate to="/utils" replace />} />
      </Route>
    </Routes>
  );
};
