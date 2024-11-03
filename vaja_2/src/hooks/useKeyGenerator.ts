// useKeyGenerator.ts
import { useState } from 'react';
import { KeyPaths } from '../types/common';
import { generateMillerRabinPrime } from '../modules/millerRabin';
import { random } from '../utils/utils';

export const useKeyGenerator = () => {
  const pubKeyPath = 'pubkey.txt';
  const privKeyPath = 'privkey.txt';
  const [bitLength, setBitLength] = useState<number>(3);
  const [keys, setKeys] = useState<{ pubKey: string, privKey: string }>({ pubKey: '', privKey: '' });
  const [generationTime, setGenerationTime] = useState<number | null>(null);

  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  const getPhi = (p: number, q: number): number => (p - 1) * (q - 1);

  function extendedEuclidean(a: number, b: number): { d: number; x: number; y: number } {
    if (b === 0) {
      return { d: a, x: 1, y: 0 };
    }

    const { d, x: n_x, y: n_y } = extendedEuclidean(b, a % b);
    const x = n_y;
    const y = n_x - Math.floor(a / b) * n_y;

    return { d, x, y };
  }

  const modLinearEquationSolver = (a: number, b: number, n: number): number => {
    const { d, x } = extendedEuclidean(a, n);
    if (d % b === 0) {
      let x0 = (x * (b / d)) % n;
      if (x0 < 0) x0 += n; // Ensure positive result
      return x0;
    }
    throw new Error(`No solution for modular linear equation: ${a}x ≡ ${b} (mod ${n})`);
  };

  const generatePrime = (bits: number): number => {
    return generateMillerRabinPrime(bits, 20);
  };

  const generateKeys = async () => {
    const startTime = performance.now();

    const p = generatePrime(bitLength);
    const q = generatePrime(bitLength);
    if (p === q) throw new Error("p and q must be different primes");

    const n = p * q;
    const phi = getPhi(p, q);

    let e = random(2, phi);
    while (gcd(e, phi) !== 1 || e % 2 !== 1) {
      e = random(2, phi);
    }

    const d = modLinearEquationSolver(e, 1, phi);

    setKeys({
      pubKey: `{n:${n}, e:${e}}`,
      privKey: `{n:${n}, d:${d}}`
    });

    setGenerationTime(performance.now() - startTime);
  };

  const saveKeysInFile = () => {
    if (!keys.pubKey || !keys.privKey) {
      throw new Error("Keys have not been generated.");
    }

    // Save public key file
    const pubKeyBlob = new Blob([keys.pubKey], { type: 'text/plain' });
    const pubKeyUrl = URL.createObjectURL(pubKeyBlob);
    const pubKeyLink = document.createElement('a');
    pubKeyLink.href = pubKeyUrl;
    pubKeyLink.download = pubKeyPath;
    pubKeyLink.click();
    URL.revokeObjectURL(pubKeyUrl);

    // Save private key file
    const privKeyBlob = new Blob([keys.privKey], { type: 'text/plain' });
    const privKeyUrl = URL.createObjectURL(privKeyBlob);
    const privKeyLink = document.createElement('a');
    privKeyLink.href = privKeyUrl;
    privKeyLink.download = privKeyPath;
    privKeyLink.click();
    URL.revokeObjectURL(privKeyUrl);
  };

  return { bitLength, setBitLength, keys, generationTime, generateKeys, saveKeysInFile };
};
