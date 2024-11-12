import { generateMillerRabinPrime } from '../modules/millerRabin';
import { gcd, getPhi, modLinearEquationSolver, random } from './utils';

const generatePrime = (bits: number): bigint => {
  return generateMillerRabinPrime(bits, 20);
};

export const generateKeys = (bitLength: number) => {
  const p = generatePrime(bitLength);
  const q = generatePrime(bitLength);

  if (p === q) throw new Error("p and q must be different primes");

  const n = p * q;
  const phi = getPhi(p, q);

  let e = BigInt(random(BigInt(2), phi));
  while (gcd(e, phi) !== BigInt(1) || e % BigInt(2) === BigInt(0)) {
    e = BigInt(random(BigInt(2), phi));
  }

  const d = modLinearEquationSolver(e, BigInt(1), phi);

  return {
    pubKey: `{"n":"${n}", "e":"${e}"}`,
    privKey: `{"n":"${n}", "d":"${d}"}`
  };
};
