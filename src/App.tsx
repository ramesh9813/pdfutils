import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { PdfProvider } from './context/PdfContext';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <PdfProvider>
        <AppRoutes />
      </PdfProvider>
    </BrowserRouter>
  );
};

export default App;
