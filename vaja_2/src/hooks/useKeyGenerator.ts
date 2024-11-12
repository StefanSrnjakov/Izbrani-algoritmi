// src/hooks/useKeyGenerator.ts

import { useState } from 'react';
import { generateKeys } from '../utils/keyGenerationUtils';

export const useKeyGenerator = () => {
  const pubKeyPath = 'pubkey.txt';
  const privKeyPath = 'privkey.txt';
  const [bitLength, setBitLength] = useState<number>(3);
  const [keys, setKeys] = useState<{ pubKey: string; privKey: string }>({ pubKey: '', privKey: '' });
  const [generationTime, setGenerationTime] = useState<number | null>(null);

  const handleGenerateKeys = async () => {
    const startTime = performance.now();
    const generatedKeys = generateKeys(bitLength);
    setKeys(generatedKeys);
    setGenerationTime(performance.now() - startTime);
  };

  const saveKeysInFile = () => {
    if (!keys.pubKey || !keys.privKey) {
      throw new Error("Keys have not been generated.");
    }

    const pubKeyBlob = new Blob([keys.pubKey], { type: 'text/plain' });
    const pubKeyUrl = URL.createObjectURL(pubKeyBlob);
    const pubKeyLink = document.createElement('a');
    pubKeyLink.href = pubKeyUrl;
    pubKeyLink.download = pubKeyPath;
    pubKeyLink.click();
    URL.revokeObjectURL(pubKeyUrl);

    const privKeyBlob = new Blob([keys.privKey], { type: 'text/plain' });
    const privKeyUrl = URL.createObjectURL(privKeyBlob);
    const privKeyLink = document.createElement('a');
    privKeyLink.href = privKeyUrl;
    privKeyLink.download = privKeyPath;
    privKeyLink.click();
    URL.revokeObjectURL(privKeyUrl);
  };

  return { bitLength, setBitLength, keys, generationTime, generateKeys: handleGenerateKeys, saveKeysInFile };
};
