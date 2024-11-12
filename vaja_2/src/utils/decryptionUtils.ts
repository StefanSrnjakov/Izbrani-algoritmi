import { modularExponentiation } from '../modules/millerRabin';
import { convertToBytes, extractBits } from './bitUtils';
import { readFileContent } from './fileUtils';

export const startDecryption = async (
  file: File,
  privateKey: { n: string; d: string },
  setDecryptedContent: (content: Uint8Array) => void
): Promise<Uint8Array | void> => {
  if (!file || !privateKey) {
    console.error("Error: Missing file or private key");
    return;
  }

  // Step 1: Read the file content as Uint8Array and convert to binary string
  const fileContent = await readFileContent(file);

  const { n, d } = privateKey;
  const nBigInt = BigInt(n);
  const dBigInt = BigInt(d);

  const readBitLength = nBigInt.toString(2).length;
  const writeBitLength = nBigInt.toString(2).length - 1;

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

    const { value: encryptedBlock, newOffset } = result;
    bitOffset = newOffset;

    const decryptedBlock = modularExponentiation(encryptedBlock, dBigInt, nBigInt);

    const decryptedBinary = decryptedBlock.toString(2).padStart(writeBitLength, '0');
    accumulatedBinaryChunks.push(decryptedBinary);
  }

  const accumulatedBinaryString = accumulatedBinaryChunks.join('');
  const finalDecryptedContent = convertToBytes(accumulatedBinaryString);

  if (setDecryptedContent){
    setDecryptedContent(finalDecryptedContent);
  } else {
    return finalDecryptedContent;
  }
};
