import crypto from "crypto";
import { roundToDecimals } from "../../../utils/roundToDecimal";
import { MultiplierDetails } from "../../../types/shared/game-types";

export class MultiplierGenerator {
  private static readonly CONFIG = {
    GAME_HASH_SLICE_LEN: 13,
    HOUSE_EDGE: 0.03, // 3%
    MAX_MULTIPLIER: 4000,
    MIN_MULTIPLIER: 1,
  };

  private multiplierDetails: MultiplierDetails;

  constructor(clientSeed: string) {
    if (!clientSeed || clientSeed.trim() === "") {
      throw new Error(
        `[MultiplierGenerator]: Invalid client seed: ${clientSeed}`
      );
    }

    this.multiplierDetails = {
      finalMultiplier: null,
      rawMultiplier: null,
      normalizedHashValue: null,
      hashIntValue: null,
      clientSeed: clientSeed,
      serverSeed: null,
      serverSeedHash: null,
      combinedSeed: null,
      gameHash: null,
    };

    this.generateMultiplier();
  }

  /**
   * Generates a secure random server seed and its hashed version.
   */
  private generateServerSeed(bytesLength = 24) {
    const serverSeed = crypto.randomBytes(bytesLength).toString("base64");
    const serverSeedHash = crypto
      .createHash("sha256")
      .update(serverSeed)
      .digest("hex");

    this.multiplierDetails.serverSeed = serverSeed;
    this.multiplierDetails.serverSeedHash = serverSeedHash;
  }

  /**
   * Combines the serverSeed and clientSeed, then hashes them
   * to produce a deterministic gameHash.
   */
  private generateHash() {
    const { serverSeed, clientSeed } = this.multiplierDetails;

    if (!serverSeed) {
      throw new Error("Cannot generate game hash: server seed is missing.");
    }

    const combinedSeed = `${serverSeed}${clientSeed}`;
    const gameHash = crypto
      .createHash("sha256")
      .update(combinedSeed)
      .digest("hex");

    this.multiplierDetails.combinedSeed = combinedSeed;
    this.multiplierDetails.gameHash = gameHash;
  }

  /**
   * Derives a fair multiplier from the game hash,
   * applies house edge, and clamps to limits.
   */

  private calculateMultiplier() {
    const { gameHash } = this.multiplierDetails;
    if (!gameHash) {
      throw new Error("Game hash is missing.");
    }

    const sliceLen = MultiplierGenerator.CONFIG.GAME_HASH_SLICE_LEN;
    const slicedHash = gameHash.slice(0, sliceLen); // First 13 hex characters

    const byteLength = sliceLen / 2; // Convert hex chars to byte count
    const bitCount = byteLength * 8; // Total bits
    const maxHashValue = Math.pow(2, bitCount) - 1;

    const hashIntValue = parseInt(slicedHash, 16);
    const normalizedHashValue = hashIntValue / maxHashValue;

    let rawMultiplier = 1 / (1 - normalizedHashValue); // calculate Multiplier
    rawMultiplier = roundToDecimals(rawMultiplier);

    // Apply house edge (reduce payout)
    let adjustedMultiplier =
      rawMultiplier * (1 - MultiplierGenerator.CONFIG.HOUSE_EDGE);
    adjustedMultiplier = roundToDecimals(adjustedMultiplier);

    // Clamp multiplier within bounds
    const clampedMultiplier = Math.min(
      MultiplierGenerator.CONFIG.MAX_MULTIPLIER,
      Math.max(MultiplierGenerator.CONFIG.MIN_MULTIPLIER, adjustedMultiplier)
    );

    this.multiplierDetails.hashIntValue = hashIntValue;
    this.multiplierDetails.normalizedHashValue = normalizedHashValue;
    this.multiplierDetails.rawMultiplier = rawMultiplier;
    this.multiplierDetails.finalMultiplier = clampedMultiplier;
  }

  /**
   * Orchestrates the steps to generate a provably fair multiplier
   */
  private generateMultiplier() {
    this.generateServerSeed();
    this.generateHash();
    this.calculateMultiplier();
  }

  public getMultiplierDetails(): MultiplierDetails {
    return this.multiplierDetails;
  }
}
