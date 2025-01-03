const SuperDuperConstants = {
    m: Math.pow(2, 32),
    a: 69069,
    b: 0,
    R: 1,
};

const LCG = ({ m, a, b }: { m: number, a: number, b: number }) => {
    SuperDuperConstants.R = (a * SuperDuperConstants.R + b) % m;
    return SuperDuperConstants.R;
};

export const random = (min: number, max: number) => {
    return min + LCG(SuperDuperConstants) % (max - min);
};

export const measureExecutionTime = (fn: () => number): number => {
    
    const start = performance.now();
    fn();
    const end = performance.now();
    return end - start;
};

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
