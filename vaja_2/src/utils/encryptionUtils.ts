import { modularExponentiation } from '../modules/millerRabin';
import { PublicKey } from '../types/common';
import { readFileContent } from './fileUtils';
import { extractBits, convertToBytes } from './bitUtils';

export const startEncryption = async (
  key: PublicKey,
  file: File,
  setEncryptedContent: (content: Uint8Array) => void
): Promise<Uint8Array | void> => {
  if (!file || !key) {
    console.error("Error: Missing file or public key");
    return;
  }

  const fileContent = await readFileContent(file);

  const { n, e } = key;
  const nBigInt = BigInt(n);
  const eBigInt = BigInt(e);

  const readBitLength = nBigInt.toString(2).length - 1;
  const writeBitLength = nBigInt.toString(2).length;

  const binaryString = Array.from(fileContent)
    .map((byte) => byte.toString(2).padStart(8, '0'))
    .join('');

  let bitOffset = 0;
  const accumulatedBinaryChunks: string[] = [];

  while (true) {
    const result = extractBits(binaryString, bitOffset, readBitLength);
    if (!result || result.value === null) {
      break;
    }

    const { value: block, newOffset } = result;
    bitOffset = newOffset;

    const encryptedBlock = modularExponentiation(block, eBigInt, nBigInt);

    const encryptedBinary = encryptedBlock.toString(2).padStart(writeBitLength, '0');
    accumulatedBinaryChunks.push(encryptedBinary);
  }

  const accumulatedBinaryString = accumulatedBinaryChunks.join('');
  const finalEncryptedContent = convertToBytes(accumulatedBinaryString);

  if (setEncryptedContent) {
    setEncryptedContent(finalEncryptedContent);
  } else {
    return finalEncryptedContent;
  }
};
