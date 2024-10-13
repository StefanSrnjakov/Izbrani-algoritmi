import { random } from "../utils/utils";

export const modularExponentiation = (a: bigint, b: bigint, n: bigint): number => {
    let d = BigInt(1);

    while (b > BigInt(0)) {
        if (b & BigInt(1)) {
            d = (d * a) % n;
        }
        a = (a * a) % n;
        b = b >> BigInt(1);
    }

    return Number(d);
};


const getDAndK = (numberToCheck: number): { d: number, k: number } => {
    let d = numberToCheck - 1;
    let k = 0;
    while (d % 2 === 0) {
        d /= 2;
        k++;
    }
    return {d, k};
};

export const generateMillerRabinPrime = (bitCount: number, s: number): number => {
    const lowerBound = 2 ** (bitCount - 1);
    const upperBound = 2 ** bitCount - 1;

    let p = random(lowerBound, upperBound);

    if (p % 2 === 0) {
        p += 1;
    }

    while (true) {
        if (checkMillerRabinPrime(p, s)) {
            return p;
        }
        p += 2;
    }
};

export const checkMillerRabinPrime = (numberToCheck: number, s: number): boolean => {
    if (numberToCheck <= 3) return true;
    if (numberToCheck % 2 === 0) return false;

    const {d, k} = getDAndK(numberToCheck);

    for (let i = 1; i <= s; i++) {
        const a = random(2, numberToCheck - 2);
        let x = modularExponentiation(BigInt(a), BigInt(d), BigInt(numberToCheck));

        if (x === 1 || x === numberToCheck - 1) {
            continue;
        }

        let continueFlag = false;
        for (let j = 0; j < k - 1; j++) {
            x = modularExponentiation(BigInt(x), BigInt(2), BigInt(numberToCheck));

            if (x === 1) {
                return false;
            }

            if (x === numberToCheck - 1) {
                continueFlag = true;
                break;
            }
        }

        if (!continueFlag) {
            return false;
        }
    }
    return true;
};
