import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { PdfProvider } from './context/PdfContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SettingsProvider>
          <PdfProvider>
            <AppRoutes />
          </PdfProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
