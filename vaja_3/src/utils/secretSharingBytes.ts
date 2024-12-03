import { random, randomBigInt } from "./common";

export const secretSharingByBytes = async (
    n: number,
    k: number,
    secretFile: File
): Promise<Array<{ x: bigint; f: bigint[] }>> => {
    try {
        // Step 1: Read the file as an ArrayBuffer
        const arrayBuffer = await secretFile.arrayBuffer();

        // Step 2: Convert the ArrayBuffer to a Uint8Array
        const uint8Array = new Uint8Array(arrayBuffer);

        // Step 3: Delegate to secretSharingByBytesFromData
        return secretSharingByBytesFromData(BigInt(n), BigInt(k), uint8Array);
    } catch (error: any) {
        console.error("Error generating the shares:", error.message);
        return [];
    }
};

export const secretSharingByBytesFromData = (
    n: bigint,
    k: bigint,
    data: Uint8Array
): Array<{ x: bigint; f: bigint[] }> => {


    const D: Array<{ x: bigint; f: bigint[] }> = Array.from({ length: Number(n) }, (_, i) => ({
        x: BigInt(i + 1),
        f: [],
    }));

    for (let byteIndex = 0; byteIndex < data.length; byteIndex++) {
        const byte = BigInt(data[byteIndex]);

        const aArray: bigint[] = new Array(Number(k)).fill(BigInt(0));
        aArray[0] = byte;
        for (let j = 1; j < Number(k); j++) {
            aArray[j] = randomBigInt(BigInt(1), BigInt(Math.pow(2, 32 - 1)));
        }

        for (let i = 1; i <= Number(n); i++) {
            let share = BigInt(0);

            for (let j = 0; j < Number(k); j++) {
                const product = aArray[j] * BigInt(Math.pow(i, j))
                share += product;
            }

            D[i - 1].f.push(share);
        }
    }

    return D;
};
