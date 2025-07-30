import { roundToDecimals } from "../../../utils/roundToDecimal";
import { MultiplierGenerator } from "./multiplierGenerator";

type MultiplierBucket =
  | "1-1.5"
  | "1.6-2"
  | "2-3"
  | "3-4"
  | "4-5"
  | "5-10"
  | "10-30"
  | "30-50"
  | "50-100"
  | "100+";

type Range = {
  minInclusive: number;
  maxExclusive: number;
};

export class MultiplierSimulator {
  // Define multiplier buckets and their inclusive ranges
  static readonly MULTIPLIER_DISTRIBUTION: Record<MultiplierBucket, Range> = {
    "1-1.5": { minInclusive: 1, maxExclusive: 1.5 },
    "1.6-2": { minInclusive: 1.5, maxExclusive: 2 },
    "2-3": { minInclusive: 2, maxExclusive: 3 },
    "3-4": { minInclusive: 3, maxExclusive: 4 },
    "4-5": { minInclusive: 4, maxExclusive: 5 },
    "5-10": { minInclusive: 5, maxExclusive: 10 },
    "10-30": { minInclusive: 10, maxExclusive: 30 },
    "30-50": { minInclusive: 30, maxExclusive: 50 },
    "50-100": { minInclusive: 50, maxExclusive: 100 },
    "100+": { minInclusive: 100, maxExclusive: Infinity },
  };

  constructor() {}

  // Initialize distribution buckets
  private initializeBuckets() {
    const buckets: Record<string, { count: number; percentage: number }> = {};
    for (const bucket of Object.keys(
      MultiplierSimulator.MULTIPLIER_DISTRIBUTION
    )) {
      buckets[bucket] = { count: 0, percentage: 0 };
    }
    return buckets;
  }

  // Run the simulation for a number of rounds
  simulateDistribution(roundCount = 1000) {
    const distribution = this.initializeBuckets();
    const multipliers: number[] = [];

    let lowestMultiplier = Infinity;
    let highestMultiplier = -Infinity;

    for (let i = 1; i <= roundCount; i++) {
      const generator = new MultiplierGenerator();
      const { finalMultiplier } = generator.generateMultiplier("curix2013");
      const multiplier = finalMultiplier!;

      multipliers.push(multiplier);
      if (multiplier < lowestMultiplier) lowestMultiplier = multiplier;
      if (multiplier > highestMultiplier) highestMultiplier = multiplier;

      for (const [bucketName, range] of Object.entries(
        MultiplierSimulator.MULTIPLIER_DISTRIBUTION
      )) {
        if (
          multiplier >= range.minInclusive &&
          multiplier < range.maxExclusive
        ) {
          distribution[bucketName].count += 1;
          break;
        }
      }
    }

    // Calculate percentage per bucket
    for (const bucket of Object.values(distribution)) {
      bucket.percentage = roundToDecimals((bucket.count / roundCount) * 100);
    }

    return {
      distribution,
      lowestMultiplier,
      highestMultiplier,
    };
  }
}
