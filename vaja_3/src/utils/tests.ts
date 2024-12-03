import { areUint8ArraysEqual } from "./common";
import { reconstructSecretByBytesRawInput, reconstructSecretRawInputRobust, reconstructSecret, reconstructSecretRawInput } from "./reconstruction";
import { secretSharing, shamirMethodRawData } from "./secretSharing";
import { secretSharingByBytesFromData } from "./secretSharingBytes";

export interface AnalysisResponse {
    fileLength: number[];
    secretSharingTimes: number[];
    reconstructionTimes: number[];
    dataMatchAfterReconstruction: boolean[];
}
export interface ReconstructionAnalysisResponse {
    sharesPairs: { n: number; k: number }[];
    correctPercentage: number[];
}

const generateRandomArray = (length: number): Uint8Array => {
    const array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
    }
    return array;
};

export const secretSharingAnalysisBigInt = async (fileLength: number[], n: number, k: number): Promise<AnalysisResponse> => {
    const results: AnalysisResponse = {
        fileLength: [],
        secretSharingTimes: [],
        reconstructionTimes: [],
        dataMatchAfterReconstruction: [],
    };

    for (const length of fileLength) {
        const randomData = generateRandomArray(length);

        // Measure secret sharing time
        const startSharing = performance.now();
        const shares = shamirMethodRawData(n, k, randomData);
        const endSharing = performance.now();
        const sharingTime = endSharing - startSharing;

        // Measure reconstruction time
        const startReconstruction = performance.now();
        const reconstructedData = reconstructSecretRawInputRobust(shares, k);
        const endReconstruction = performance.now();
        const reconstructionTime = endReconstruction - startReconstruction;

        // Validate reconstructed data
        const isDataMatch = reconstructedData.every((byte, index) => byte === randomData[index]);

        // Append results
        results.fileLength.push(length);
        results.secretSharingTimes.push(sharingTime);
        results.reconstructionTimes.push(reconstructionTime);
        results.dataMatchAfterReconstruction.push(isDataMatch);
    }

    return results;
};

export const secretSharingAnalysisBytes = async (
    fileLength: number[],
    n: number,
    k: number
): Promise<AnalysisResponse> => {
    const results: AnalysisResponse = {
        fileLength: [],
        secretSharingTimes: [],
        reconstructionTimes: [],
        dataMatchAfterReconstruction: [],
    };

    for (const length of fileLength) {
        const randomData = generateRandomArray(length);

        // Measure secret sharing time
        const startSharing = performance.now();
        const shares = secretSharingByBytesFromData(BigInt(n), BigInt(k), randomData);
        const endSharing = performance.now();
        const sharingTime = endSharing - startSharing;

        // Measure reconstruction time
        const startReconstruction = performance.now();
        const reconstructedData = reconstructSecretByBytesRawInput(shares, BigInt(k));
        const endReconstruction = performance.now();
        const reconstructionTime = endReconstruction - startReconstruction;

        const isDataMatch = areUint8ArraysEqual(reconstructedData, randomData);

        // console.log(randomData, reconstructedData);
        results.fileLength.push(length);
        results.secretSharingTimes.push(sharingTime);
        results.reconstructionTimes.push(reconstructionTime);
        results.dataMatchAfterReconstruction.push(isDataMatch);
    }
    return results;
};

export const reconstructionRobustTest = async (
    sharesNums: { n: number; k: number }[],
    length: number,
    retries = 10
): Promise<ReconstructionAnalysisResponse> => {
    const result: ReconstructionAnalysisResponse = {
        sharesPairs: sharesNums,
        correctPercentage: [],
    };

    for (const { n, k } of sharesNums) {
        let correctCount = 0;

        for (let retry = 0; retry < retries; retry++) {
            // Generate random data
            const randomData = generateRandomArray(length);

            const shares = shamirMethodRawData(n, k, randomData);

            try {
                const reconstructedData = reconstructSecretRawInput(shares, k);

                console.log(reconstructedData, randomData);
                if (areUint8ArraysEqual(reconstructedData, randomData)) {
                    correctCount++;
                }
            } catch (error: any) {
                console.error(`Reconstruction failed for n=${n}, k=${k}, retry=${retry}:`, error.message);
            }
        }

        const percentage = (correctCount / retries) * 100;
        result.correctPercentage.push(percentage);
    }

    return result;
};

