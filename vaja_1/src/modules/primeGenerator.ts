// primeGenerator.ts
import { generateNaivePrime, checkNaivePrime } from './naivePrime';
import { generateMillerRabinPrime, checkMillerRabinPrime } from './millerRabin';

export const generatePrime = (bitCount: number, method: 'naive' | 'miller-rabin', s?: number): number => {
  if (method === 'naive') {
    return generateNaivePrime(bitCount);
  } else {
    return generateMillerRabinPrime(bitCount, s || 1);
  }
};

export const checkPrime = (numberToCheck: number, method: 'naive' | 'miller-rabin', s?: number): boolean => {
  if (method === 'naive') {
    return checkNaivePrime(numberToCheck);
  } else {
    return checkMillerRabinPrime(numberToCheck, s || 1);
  }
};
