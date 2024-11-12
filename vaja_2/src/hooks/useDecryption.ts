// src/hooks/useDecryption.ts

import { useState, useEffect } from 'react';
import { readFileContent } from '../utils/fileUtils';
import { startDecryption } from '../utils/decryptionUtils';

export const useDecryption = () => {
  const [fileToDecrypt, setFileToDecrypt] = useState<File | null>(null);
  const [privateKeyFile, setPrivateKeyFile] = useState<File | null>(null);
  const [decryptionTime, setDecryptionTime] = useState<number | null>(null);
  const [privateKey, setPrivateKey] = useState<{ n: string; d: string } | null>(null);
  const [decryptedContent, setDecryptedContent] = useState<Uint8Array | null>(null);

  const decryptFile = async () => {
    if (!fileToDecrypt || !privateKey) {
      console.log("Error: Missing file or private key");
      return;
    }

    const startTime = performance.now();
    await startDecryption(fileToDecrypt, privateKey, setDecryptedContent);
    setDecryptionTime(performance.now() - startTime);
  };

  useEffect(() => {
    if (privateKeyFile) {
      readFileContent(privateKeyFile)
        .then((privateKeyFileContent) => {
          const parsedKey = JSON.parse(new TextDecoder().decode(privateKeyFileContent));
          setPrivateKey(parsedKey);
        })
        .catch((error) => {
          console.error("Error reading private key file", error);
        });
    }
  }, [privateKeyFile]);

  return {
    fileToDecrypt,
    setFileToDecrypt,
    privateKeyFile,
    setPrivateKeyFile,
    decryptionTime,
    decryptedContent,
    decryptFile,
  };
};
