import { useState, useEffect } from 'react';
import { modularExponentiation } from '../modules/millerRabin';

export const useDecryption = () => {
  const [fileToDecrypt, setFileToDecrypt] = useState<File | null>(null);
  const [privateKeyFile, setPrivateKeyFile] = useState<File | null>(null);
  const [decryptionTime, setDecryptionTime] = useState<number | null>(null);
  const [privateKey, setPrivateKey] = useState<{ n: string, d: string } | null>(null);
  const [decryptedContent, setDecryptedContent] = useState<Uint8Array | null>(null); // Store decrypted content

  const readFileContent = (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const startDecryption = async () => {
    if (!fileToDecrypt || !privateKey) {
      console.log("Error: Missing file or private key");
      return;
    }

    console.log(`Starting decryption for file: ${fileToDecrypt.name}`);

    // Read the encrypted file content
    const fileContent = await readFileContent(fileToDecrypt);
    console.log(`Encrypted file size (bytes): ${fileContent.length}`);

    // Private key parameters and block sizes
    const { n, d } = privateKey;
    const nBigInt = BigInt(n);
    const dBigInt = BigInt(d);
    const readBitLength = Math.ceil(Math.log2(Number(nBigInt))); // bits per encrypted block
    const writeBitLength = Math.floor(Math.log2(Number(nBigInt))); // bits per decrypted block

    console.log(`Private key 'n' bit length (for reading): ${readBitLength}`);
    console.log(`Decrypted block bit length (for writing): ${writeBitLength}`);

    // Convert file content to binary string
    const binaryString = Array.from(fileContent)
      .map(byte => byte.toString(2).padStart(8, '0'))
      .join('');

    let bitOffset = 0;
    let accumulatedBinaryString = "";

    // Helper function to extract `readBitLength` bits for decryption
    function extractEncryptedBits(bits: any) {
      let value = BigInt(0);
      let bitsRead = 0;

      while (bitsRead < bits) {
        if (bitOffset >= binaryString.length) {
          return bitsRead > 0 ? value : null;
        }

        const currentBit = binaryString[bitOffset] === '1' ? 1 : 0;
        value = (value << BigInt(1)) | BigInt(currentBit);

        bitOffset += 1;
        bitsRead += 1;
      }

      return value;
    }

    // Decrypt each block and accumulate the decoded bits
    while (true) {
      const encryptedBlock = extractEncryptedBits(readBitLength);
      if (encryptedBlock === null) break;

      console.log(`Encrypted block value (as BigInt): ${encryptedBlock}`);

      // Decrypt the block: M = C^d mod n
      const decryptedBlock = modularExponentiation(encryptedBlock, dBigInt, nBigInt);
      console.log(`Decrypted block value (as BigInt): ${decryptedBlock}`);

      // Convert decrypted block to binary string of `writeBitLength` length
      const decryptedBinary = decryptedBlock.toString(2).padStart(writeBitLength, '0');
      console.log(`Decrypted block as binary (padded to ${writeBitLength} bits): ${decryptedBinary}`);

      // Accumulate the decrypted binary string
      accumulatedBinaryString += decryptedBinary;
    }

    // Convert accumulated binary string to bytes
    const finalDecryptedContent = new Uint8Array(Math.ceil(accumulatedBinaryString.length / 8));
    for (let i = 0; i < accumulatedBinaryString.length; i += 8) {
      const byteString = accumulatedBinaryString.slice(i, i + 8).padEnd(8, '0'); // pad last byte if needed
      finalDecryptedContent[i / 8] = parseInt(byteString, 2);
    }

    setDecryptedContent(finalDecryptedContent); // Save decrypted content

    console.log("File decryption completed.");
    console.log(`Final decrypted content (bytes): ${finalDecryptedContent}`);
    console.log(`Total decrypted content size: ${finalDecryptedContent.length} bytes`);

    return finalDecryptedContent;
  };


  const decryptFile = async () => {
    if (!fileToDecrypt || !privateKeyFile) {
      console.log("No file or private key to decrypt");
      return;
    }

    const startTime = performance.now();

    const decryptedContent = await startDecryption();

    setDecryptionTime(performance.now() - startTime);

    const originalFileName = fileToDecrypt.name.replace(/\.enc$/, '');
    console.log(`Decrypted file will be saved as: ${originalFileName}`);

    if (decryptedContent) {
      const blob = new Blob([decryptedContent], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = originalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
    decryptedContent, // Export decrypted content for download
    decryptFile,
  };
};
