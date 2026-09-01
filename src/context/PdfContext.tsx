import React, { createContext, useContext, useState, useCallback } from 'react';

export interface PdfContextType {
  sharedFile: File | null;
  setSharedFile: (file: File | null) => void;
  clearSharedFile: () => void;
}

const PdfContext = createContext<PdfContextType | undefined>(undefined);

export const PdfProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sharedFile, setSharedFileState] = useState<File | null>(null);

  const setSharedFile = useCallback((file: File | null) => {
    setSharedFileState(file);
  }, []);

  const clearSharedFile = useCallback(() => {
    setSharedFileState(null);
  }, []);

  return (
    <PdfContext.Provider value={{ sharedFile, setSharedFile, clearSharedFile }}>
      {children}
    </PdfContext.Provider>
  );
};

export function useSharedPdf() {
  const context = useContext(PdfContext);
  if (!context) {
    throw new Error('useSharedPdf must be used within a PdfProvider');
  }
  return context;
}
