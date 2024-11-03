import { useState, useEffect } from 'react';
import { modularExponentiation } from '../modules/millerRabin';

export const useEncryption = () => {
  const [fileToEncrypt, setFileToEncrypt] = useState<File | null>(null);
  const [publicKeyFile, setPublicKeyFile] = useState<File | null>(null);
  const [encryptionTime, setEncryptionTime] = useState<number | null>(null);
  const [publicKey, setPublicKey] = useState<{ n: string, e: string } | null>(null);
  const [encryptedContent, setEncryptedContent] = useState<Uint8Array | null>(null); // Store encrypted content

  const readFileContent = (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const startEncryption = async () => {
    if (!fileToEncrypt || !publicKey) {
        console.log("Error: Missing file or public key");
        return;
    }

    console.log(`Starting encryption for file: ${fileToEncrypt.name}`);

    // Read the whole file as a Uint8Array
    const fileContent = await readFileContent(fileToEncrypt);
    console.log(`File size (bytes): ${fileContent.length}`);

    // Get the public key values and calculate bit lengths
    const { n, e } = publicKey;
    const nBigInt = BigInt(n);
    const eBigInt = BigInt(e);
    const readBitLength = Math.floor(Math.log2(Number(eBigInt))); // bits to read per block
    const writeBitLength = Math.ceil(Math.log2(Number(nBigInt))); // bits to write per encrypted block

    console.log(`Public key 'e' bit length (for reading): ${readBitLength}`);
    console.log(`Public key 'n' bit length (for writing): ${writeBitLength}`);

    // Calculate bytes per block based on bit length
    const bytesPerReadBlock = Math.ceil(readBitLength / 8);

    console.log(`Bytes per read block: ${bytesPerReadBlock}`);

    let bitOffset = 0;
    let accumulatedBinaryString = "";

    // Helper function to extract `readBitLength` bits as a BigInt
    function extractBits(bits : any) {
        let value = BigInt(0);
        let bitsRead = 0;

        while (bitsRead < bits) {
            const byteIndex = Math.floor(bitOffset / 8);
            const bitInByte = bitOffset % 8;

            if (byteIndex >= fileContent.length) {
                return bitsRead > 0 ? value : null;
            }

            const availableBits = Math.min(8 - bitInByte, bits - bitsRead);
            const mask = (1 << availableBits) - 1;

            value = (value << BigInt(availableBits)) | BigInt((fileContent[byteIndex] >> (8 - bitInByte - availableBits)) & mask);

            bitOffset += availableBits;
            bitsRead += availableBits;
        }

        return value;
    }

    // Encrypt each block and append its binary representation to the accumulating string
    while (true) {
        const block = extractBits(readBitLength);
        if (block === null) break;

        console.log(`Block value (as BigInt for encryption): ${block}`);

        // Encrypt the block: C = block^e mod n
        const encryptedBlock = modularExponentiation(block, eBigInt, nBigInt);
        console.log(`Encrypted block value (as BigInt): ${encryptedBlock}`);

        // Convert encrypted block to binary string of `writeBitLength` length
        const encryptedBinary = encryptedBlock.toString(2).padStart(writeBitLength, '0');
        console.log(`Encrypted block as binary (padded to ${writeBitLength} bits): ${encryptedBinary}`);

        // Accumulate the binary string
        accumulatedBinaryString += encryptedBinary;
    }

    // Convert accumulated binary string to bytes
    const finalEncryptedContent = new Uint8Array(Math.ceil(accumulatedBinaryString.length / 8));
    for (let i = 0; i < accumulatedBinaryString.length; i += 8) {
        const byteString = accumulatedBinaryString.slice(i, i + 8).padEnd(8, '0'); // pad last byte if needed
        finalEncryptedContent[i / 8] = parseInt(byteString, 2);
    }

    setEncryptedContent(finalEncryptedContent); // Save encrypted content for download

    console.log("File encryption completed.");
    console.log(`Final encrypted content (bytes): ${finalEncryptedContent}`);
    console.log(`Total encrypted content size: ${finalEncryptedContent.length} bytes`);

    const binaryStringWithSpacing = Array.from(finalEncryptedContent)
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join('')
        .replace(/(.{4})/g, '$1 '); // Insert space every 4 bits

    console.log(`Binary string with spaces every 4 bits: ${binaryStringWithSpacing.trim()}`);

    return finalEncryptedContent;
};


  


  const encryptFile = async () => {
    if (!fileToEncrypt || !publicKeyFile) {
      console.log("No file or public key to encrypt");
      return;
    }

    const startTime = performance.now();

    await startEncryption();

    setEncryptionTime(performance.now() - startTime);
  };

  // Automatically update publicKey when publicKeyFile changes
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
    encryptedContent, // Export encrypted content for download
    encryptFile,
  };
};
