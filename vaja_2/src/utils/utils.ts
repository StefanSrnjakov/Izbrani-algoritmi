const SuperDuperConstants = {
    m: BigInt(2) ** BigInt(32),
    a: BigInt(69069),
    b: BigInt(0),
    R: BigInt(1),
};

const LCG = ({ m, a, b }: { m: bigint, a: bigint, b: bigint }): bigint => {
    SuperDuperConstants.R = (a * SuperDuperConstants.R + b) % m;
    return SuperDuperConstants.R;
};

export const random = (min: bigint, max: bigint): bigint => {
    const range = max - min;
    return min + (LCG(SuperDuperConstants) % range);
};

export const gcd = (a: bigint, b: bigint): bigint => {
    while (b !== BigInt(0)) {
        [a, b] = [b, a % b];
    }
    return a;
};

export const getPhi = (p: bigint, q: bigint): bigint => (p - BigInt(1)) * (q - BigInt(1));

export function extendedEuclidean(a: bigint, b: bigint): { d: bigint; x: bigint; y: bigint } {
    if (b === BigInt(0)) {
        return { d: a, x: BigInt(1), y: BigInt(0) };
    }

    const { d, x: n_x, y: n_y } = extendedEuclidean(b, a % b);
    const x = n_y;
    const y = n_x - (a / b) * n_y;

    return { d, x, y };
}

export const modLinearEquationSolver = (a: bigint, b: bigint, n: bigint): bigint => {
    const { d, x } = extendedEuclidean(a, n);
    if (b % d === BigInt(0)) {
        let x0 = (x * (b / d)) % n;
        if (x0 < BigInt(0)) x0 += n;
        return x0;
    }
    throw new Error(`No solution for modular linear equation: ${a}x ≡ ${b} (mod ${n})`);
};
