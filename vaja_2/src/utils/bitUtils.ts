
export const extractBits = (
    binaryString: string,
    bitOffset: number,
    readBitLength: number
): { value: bigint; newOffset: number } | null => {
    let value = BigInt(0);
    let bitsRead = 0;

    while (bitsRead < readBitLength) {
        if (bitOffset >= binaryString.length) {
            return bitsRead > 0 ? { value, newOffset: bitOffset } : null;
        }

        const currentBit = binaryString[bitOffset] === '1' ? 1 : 0;
        value = (value << BigInt(1)) | BigInt(currentBit);

        bitOffset += 1;
        bitsRead += 1;
    }

    return { value, newOffset: bitOffset };
};

export const convertToBytes = (binaryString: string): Uint8Array => {
    const byteArray = new Uint8Array(Math.ceil(binaryString.length / 8));
    for (let i = 0; i < binaryString.length; i += 8) {
        const byteString = binaryString.slice(i, i + 8).padEnd(8, '0');
        byteArray[i / 8] = parseInt(byteString, 2);
    }
    return byteArray;
};
