import { random } from "../utils/utils";

export const generateNaivePrime = (bitCount: number): number => {
    const lowerBound = 2 ** (bitCount - 1);
    const upperBound = 2 ** bitCount - 1;

    let p = random(lowerBound, upperBound);

    if (p % 2 === 0) {
        p += 1;
    }

    while (true) {
        if (checkNaivePrime(p)) {
            return p;
        }
        p += 2;
    }
};

export const checkNaivePrime = (numberToCheck: number): boolean => {
    if (numberToCheck <= 3) return true;
    if (numberToCheck % 2 === 0) return false;

    let j = 3;
    while (j * j <= numberToCheck) {
        if (numberToCheck % j === 0) {
            return false;
        }
        j += 2;
    }
    return true;
};
