export interface KeyPaths {
    publicKeyPath: string;
    privateKeyPath: string;
}

export interface PerformanceData {
    bitLength: number;
    generationTime: number;
    encryptionTime: number;
    decryptionTime: number;
}

export interface PublicKey {
    n: string;
    e: string;
  }