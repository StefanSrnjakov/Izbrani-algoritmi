import { generateMillerRabinPrime } from "../modules/millerRabin";
import { generateNaivePrime } from "../modules/naivePrime";
import { measureExecutionTime } from "../utils/utils";

export const measureNaiveVsMillerRabin = (minBits: number, maxBits: number, s: number) => {
    const results: { n: number, naiveTime: number, millerRabinTime: number }[] = [];

    for (let n = minBits; n <= maxBits; n++) {
        const naiveTime = measureExecutionTime(() => generateNaivePrime(n));

        const millerRabinTime = measureExecutionTime(() => generateMillerRabinPrime(n, s));

        results.push({ n, naiveTime, millerRabinTime });
    }

    return results;
};

export const measureMillerRabinWithVaryingS = (bitSize: number, minS: number, maxS: number) => {
    const results: { s: number, time: number }[] = [];

    for (let s = minS; s <= maxS; s++) {
        const time = measureExecutionTime(() => generateMillerRabinPrime(bitSize, s));
        results.push({ s, time });
    }

    return results;
};