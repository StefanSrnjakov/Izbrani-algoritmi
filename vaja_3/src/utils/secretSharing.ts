import { random, randomBigInt } from "./common";

export const secretSharing = async (n: number, k: number, secretFile: File): Promise<Array<{ x: number, f: bigint }>> => {
    try {
        // Step 1: Read the file as an ArrayBuffer
        const arrayBuffer = await secretFile.arrayBuffer();

        // Step 2: Convert the ArrayBuffer to a Uint8Array
        const uint8Array = new Uint8Array(arrayBuffer);

        return shamirMethodRawData(n, k, uint8Array);

    } catch (error: any) {
        console.error("Error reading or converting the file:", error.message);
        return []
    }
};

export const shamirMethodRawData = (n: number, k: number, uint8Array: Uint8Array): Array<{ x: number, f: bigint }> => {
    try {
        let secret = BigInt(0);
        for (let i = 0; i < uint8Array.length; i++) {
            secret = (secret << BigInt(8)) + BigInt(uint8Array[i]);
        }

        const aArray: Array<bigint> = new Array(k).fill(BigInt(0));
        const D: Array<{ x: number, f: bigint }> = [];
        aArray[0] = secret;
        for (let i = 1; i < k; i++) {
            aArray[i] = randomBigInt(BigInt(1), BigInt(Math.pow(2, 32 - 1)));
        }

        for (let i = 1; i <= n; i++) {
            let share = BigInt(0);
            for (let j = 0; j < k; j++) {
                const product = aArray[j] * BigInt(i) ** BigInt(j);
                share += product;
            }
            D.push({ x: i, f: share });
        }

        return D;
    } catch (error: any) {
        console.error("Error generating the shares:", error.message);
        return []
    }
};





