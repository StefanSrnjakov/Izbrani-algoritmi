export const reconstructSecret = async (files: File[], k: number): Promise<Uint8Array> => {
    const shares = await processShares(files);
    const secret = reconstructSecretRawInputRobust(shares, k);
    return secret;
};
export const reconstructSecretRawInputRobust = (shares: { x: number; f: bigint }[], k: number): Uint8Array => {
    if (shares.length < k) {
        throw new Error('Not enough shares to reconstruct the secret.');
    }
    let downGlobal = BigInt(1);
    for (let j = 0; j < k; j++) {
        for (let i = 0; i < k; i++) {
            if (i !== j) {
                downGlobal *= BigInt(shares[i].x - shares[j].x);
            }
        }
    }

    let S = BigInt(0);

    for (let j = 0; j < k; j++) {
        let up = BigInt(1);
        let downLocal = BigInt(1);

        for (let i = 0; i < k; i++) {
            if (i !== j) {
                up *= BigInt(shares[i].x);
                downLocal *= BigInt(shares[i].x - shares[j].x);
            }
        }

        S += shares[j].f * up * (downGlobal / downLocal);
    }

    S /= downGlobal;
    return convertBigIntToUint8Array(S);
}
export const reconstructSecretRawInputVcera = (shares: { x: number; f: bigint }[], k: number): Uint8Array => {
    console.log('vcera');
    if (shares.length < k) {
        throw new Error('Not enough shares to reconstruct the secret.');
    }

    let S = BigInt(0);

    // Loop through each share to calculate its contribution to S
    for (let j = 0; j < k; j++) {
        let numerator = BigInt(1);
        let denominator = BigInt(1);

        // Compute the Lagrange basis polynomial
        for (let i = 0; i < k; i++) {
            if (i !== j) {
                numerator *= BigInt(shares[i].x);
                denominator *= BigInt(shares[i].x - shares[j].x);
            }
        }

        // Add the contribution of the current share
        S += shares[j].f * numerator / denominator;
    }

    return convertBigIntToUint8Array(S);
};
export const reconstructSecretRawInput = (shares: { x: number; f: bigint }[], k: number): Uint8Array => {
    if (shares.length < k) {
        throw new Error('Not enough shares to reconstruct the secret.');
    }

    let S = BigInt(0);

    // Loop through each share to calculate its contribution to S
    for (let j = 0; j < k; j++) {
        let product = 1;
        // Compute the Lagrange basis polynomial
        for (let i = 0; i < k; i++) {
            if (i !== j) {
                product *= shares[i].x / (shares[i].x - shares[j].x);
            }
        }

        // Add the contribution of the current share
        S += shares[j].f * BigInt(Math.round(product));
    }

    return convertBigIntToUint8Array(S);
};
export const processShares = async (files: File[]): Promise<{ x: number; f: bigint }[]> => {
    const shares: { x: number; f: bigint }[] = [];

    for (const file of files) {
        const text = await file.text();
        try {
            const json = JSON.parse(text);
            if (json.x === undefined || json.f === undefined) {
                throw new Error(`Invalid JSON format in file: ${file.name}`);
            }
            shares.push({ x: Number(json.x), f: BigInt(json.f) });
        } catch (error: any) {
            throw new Error(`Error parsing file ${file.name}: ${error.message}`);
        }
    }

    return shares;
};


const convertBigIntToUint8Array = (bigInt: bigint): Uint8Array => {
    const binaryString = bigInt.toString(2);
    const paddedBinaryString = binaryString.padStart(Math.ceil(binaryString.length / 8) * 8, '0');
    const byteArray = new Uint8Array(paddedBinaryString.match(/.{1,8}/g)!.map(byte => parseInt(byte, 2)));
    return byteArray;
}

export const reconstructSecretByBytes = async (files: File[], k: number): Promise<Blob> => {
    const shares = await processSharesForBytes(files);

    // Get a single Uint8Array from the reconstruction
    const dataArray = reconstructSecretByBytesRawInput(shares, BigInt(k));

    return new Blob([dataArray]); // Create a Blob from the single Uint8Array
};

export const processSharesForBytes = async (
    files: File[]
): Promise<{ x: bigint; f: bigint[] }[]> => {
    const shares: { x: bigint; f: bigint[] }[] = [];

    for (const file of files) {
        const text = await file.text();
        try {
            const json = JSON.parse(text);
            if (json.x === undefined || !Array.isArray(json.f)) {
                throw new Error(`Invalid JSON format in file: ${file.name}`);
            }
            shares.push({
                x: BigInt(json.x),
                f: json.f.map((value: any) => BigInt(value)),
            });
        } catch (error: any) {
            throw new Error(`Error parsing file ${file.name}: ${error.message}`);
        }
    }

    return shares;
};

export const reconstructSecretByBytesRawInput = (
    shares: { x: bigint; f: bigint[] }[],
    k: bigint
): Uint8Array => {
    const byteArrays: number[] = [];

    for (let i = 0; i < shares[0].f.length; i++) {
        const byteShares = [];
        for (let j = 0; j < shares.length; j++) {
            byteShares.push({
                x: shares[j].x,
                f: shares[j].f[i],
            });
        }

        const reconstructedByte = reconstructByte(byteShares, k);

        // Use a traditional for loop to add bytes to the array
        for (let b = 0; b < reconstructedByte.length; b++) {
            byteArrays.push(reconstructedByte[b]);
        }
    }

    // Convert BigInt values back to regular numbers for Uint8Array
    return new Uint8Array(byteArrays.map((value) => Number(value)));
};

const reconstructByte = (
    shares: { x: bigint; f: bigint }[],
    k: bigint
): Uint8Array => {
    if (shares.length < Number(k)) {
        throw new Error('Not enough shares to reconstruct the secret.');
    }

    let downGlobal = BigInt(1);
    for (let j = 0; j < Number(k); j++) {
        for (let i = 0; i < Number(k); i++) {
            if (i !== j) {
                downGlobal *= shares[i].x - shares[j].x;
            }
        }
    }

    let S = BigInt(0);

    for (let j = 0; j < Number(k); j++) {
        let up = BigInt(1);
        let downLocal = BigInt(1);

        for (let i = 0; i < Number(k); i++) {
            if (i !== j) {
                up *= shares[i].x;
                downLocal *= shares[i].x - shares[j].x;
            }
        }

        S += shares[j].f * up * (downGlobal / downLocal);
    }

    S /= downGlobal;

    // Convert BigInt to a byte and return it in Uint8Array format
    return new Uint8Array([Number(S)]);
};
