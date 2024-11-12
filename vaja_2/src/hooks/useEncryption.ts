import { useState, useEffect } from 'react';
import { PublicKey } from '../types/common';
import { readFileContent } from '../utils/fileUtils';
import { startEncryption } from '../utils/encryptionUtils';

export const useEncryption = () => {
  const [fileToEncrypt, setFileToEncrypt] = useState<File | null>(null);
  const [publicKeyFile, setPublicKeyFile] = useState<File | null>(null);
  const [encryptionTime, setEncryptionTime] = useState<number | null>(null);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [encryptedContent, setEncryptedContent] = useState<Uint8Array | null>(null);

  const encryptFile = async () => {
    if (!fileToEncrypt || !publicKeyFile || !publicKey) {
      console.log("No file or public key to encrypt");
      return;
    }

    const startTime = performance.now();

    await startEncryption(publicKey, fileToEncrypt, setEncryptedContent);

    setEncryptionTime(performance.now() - startTime);
  };

  useEffect(() => {
    if (publicKeyFile) {
      readFileContent(publicKeyFile)
        .then((publicKeyFileContent) => {
          const parsedKey = JSON.parse(new TextDecoder().decode(publicKeyFileContent));
          setPublicKey(parsedKey);
        })
        .catch((error) => {
          console.error("Error reading public key file", error);
        });
    }
  }, [publicKeyFile]);

  return {
    fileToEncrypt,
    setFileToEncrypt,
    publicKeyFile,
    setPublicKeyFile,
    encryptionTime,
    encryptedContent,
    encryptFile,
  };
};
