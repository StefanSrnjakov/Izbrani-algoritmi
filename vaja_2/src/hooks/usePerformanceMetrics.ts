// usePerformanceMetrics.ts
import { useState } from 'react';

interface PerformanceData {
  bitLength: number;
  generationTime: number;
  encryptionTime: number;
  decryptionTime: number;
}

export const usePerformanceMetrics = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);

  const addPerformanceData = (data: PerformanceData) => {
    setPerformanceData((prevData) => [...prevData, data]);
  };

  return { performanceData, addPerformanceData };
};
