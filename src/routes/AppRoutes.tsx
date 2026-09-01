import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LandingPage } from '../pages/LandingPage';
import { UtilitiesHubPage } from '../pages/UtilitiesHubPage';
import { SplitPdfPage } from '../pages/SplitPdfPage';
import { JoinPdfPage } from '../pages/JoinPdfPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/hub" element={<UtilitiesHubPage />} />
        <Route path="/split" element={<SplitPdfPage />} />
        <Route path="/merge" element={<JoinPdfPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
