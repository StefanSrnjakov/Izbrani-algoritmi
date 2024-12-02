export const random = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export const randomBigInt = (min: bigint, max: bigint): bigint => {
    const range = max - min + BigInt(1); // Calculate the range
    const random = BigInt(Math.floor(Math.random() * Number(range))); // Generate a random number within the range
    return min + random; // Offset by the minimum value
};

export function areUint8ArraysEqual(arr1: Uint8Array, arr2: Uint8Array): boolean {
    if (arr1.length !== arr2.length) {
        // console.log(`Arrays have different lengths: arr1 (${arr1.length}), arr2 (${arr2.length})`);
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            // console.log(`Difference found at index ${i}: arr1[${i}] = ${arr1[i]}, arr2[${i}] = ${arr2[i]}`);
            // console.log(arr1, arr2);
            return false;
        }
    }

    return true;
}
