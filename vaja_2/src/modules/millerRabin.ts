import { random } from "../utils/utils";

export const modularExponentiation = (a: bigint, b: bigint, n: bigint): bigint => {
    let d = BigInt(1);

    while (b > BigInt(0)) {
        if (b & BigInt(1)) {
            d = (d * a) % n;
        }
        a = (a * a) % n;
        b = b >> BigInt(1);
    }

    return d;
};

const getDAndK = (numberToCheck: bigint): { d: bigint, k: number } => {
    let d = numberToCheck - BigInt(1);
    let k = 0;
    while (d % BigInt(2) === BigInt(0)) {
        d /= BigInt(2);
        k++;
    }
    return { d, k };
};

export const generateMillerRabinPrime = (bitCount: number, s: number): bigint => {
    const lowerBound = BigInt(2) ** BigInt(bitCount - 1);
    const upperBound = BigInt(2) ** BigInt(bitCount) - BigInt(1);

    let p = BigInt(random(lowerBound, upperBound));

    if (p % BigInt(2) === BigInt(0)) {
        p += BigInt(1);
    }

    while (true) {
        if (checkMillerRabinPrime(p, s)) {
            return p;
        }
        p += BigInt(2);
    }
};

export const checkMillerRabinPrime = (numberToCheck: bigint, s: number): boolean => {
    if (numberToCheck <= BigInt(3)) return true;
    if (numberToCheck % BigInt(2) === BigInt(0)) return false;

    const { d, k } = getDAndK(numberToCheck);

    for (let i = 1; i <= s; i++) {
        const a = BigInt(random(BigInt(2), numberToCheck - BigInt(2)));
        let x = modularExponentiation(a, d, numberToCheck);

        if (x === BigInt(1) || x === numberToCheck - BigInt(1)) {
            continue;
        }

        let continueFlag = false;
        for (let j = 0; j < k - 1; j++) {
            x = modularExponentiation(x, BigInt(2), numberToCheck);

            if (x === BigInt(1)) {
                return false;
            }

            if (x === numberToCheck - BigInt(1)) {
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
