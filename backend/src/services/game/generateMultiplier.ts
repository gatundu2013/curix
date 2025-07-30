import crypto from "crypto";

export class MultiplierGenerator {
  private static readonly CONFIG = {
    GAME_HASH_SLICE_LEN: 13,
    HOUSE_EDGE: 0.02, // 2%
    MAX_MULTIPLIER: 4000,
    MIN_MULTIPLIER: 1,
  };

  private serverSeed: string | null = null;
  private hashedServerSeed: string | null = null;
  private gameHash: string | null = null;
  private hashIntValue: number | null = null;
  private normalizedHashValue: number | null = null;
  private rawMultiplier: number | null = null;
  private finalMultiplier: number | null = null;
  private clientSeed: string | null = null;

  constructor(clientSeed: string) {
    if (!clientSeed) {
      throw new Error("Client seed is required");
    }

    this.clientSeed = clientSeed;
    this.generateResults();
  }

  /**
   * Generates a secure random server seed (base64) and its SHA-256 hash.
   */
  private generateServerSeed(bytesLength = 24) {
    const serverSeed = crypto.randomBytes(bytesLength).toString("base64");
    const hashedServerSeed = crypto
      .createHash("sha256")
      .update(serverSeed)
      .digest("hex");

    this.serverSeed = serverSeed;
    this.hashedServerSeed = hashedServerSeed;
  }

  /**
   * Combines the server and client seeds and hashes them to get a deterministic game hash.
   */
  private generateHash() {
    if (!this.serverSeed) {
      throw new Error("Server seed has not been generated");
    }

    const combinedSeed = `${this.serverSeed}${this.clientSeed}`;
    const gameHash = crypto
      .createHash("sha256")
      .update(combinedSeed)
      .digest("hex");

    this.gameHash = gameHash;
  }

  /**
   * Converts the start of the hash into a decimal, then normalizes it,
   * and applies an inverse curve to produce a multiplier.
   */
  private generateMultiplier() {
    if (!this.gameHash) {
      throw new Error("Game hash was not generated");
    }

    const sliceLen = MultiplierGenerator.CONFIG.GAME_HASH_SLICE_LEN;
    const slicedHash = this.gameHash.slice(0, sliceLen);

    const byteLength = sliceLen / 2; // 1 bytes === 2 hex char
    const bitCount = byteLength * 8;
    const maxHashValue = Math.pow(2, bitCount) - 1;

    const hashIntValue = parseInt(slicedHash, 16);
    const normalizedHashValue = hashIntValue / maxHashValue;

    const rawMultiplier = 1 / (1 - normalizedHashValue);
    const adjustedMultiplier =
      rawMultiplier * (1 - MultiplierGenerator.CONFIG.HOUSE_EDGE); // Apply house edge

    const clampedMultiplier = Math.min(
      MultiplierGenerator.CONFIG.MAX_MULTIPLIER,
      Math.max(MultiplierGenerator.CONFIG.MIN_MULTIPLIER, adjustedMultiplier)
    );

    this.hashIntValue = hashIntValue;
    this.normalizedHashValue = normalizedHashValue;
    this.rawMultiplier = rawMultiplier;
    this.finalMultiplier = clampedMultiplier;
  }

  /**
   * Generate Results.
   */
  private generateResults() {
    this.generateServerSeed();
    this.generateHash();
    this.generateMultiplier();
  }

  /**
   * Returns all the key details of the multiplier generation process
   */
  public getMultiplierDetails() {
    return {
      finalMultiplier: this.finalMultiplier,
      rawMultiplier: this.rawMultiplier,
      normalizedHashValue: this.normalizedHashValue,
      hashIntValue: this.hashIntValue,
      clientSeed: this.clientSeed,
      serverSeed: this.serverSeed,
      serverSeedHash: this.hashedServerSeed,
      combinedSeed: `${this.serverSeed}${this.clientSeed}`,
      gameHash: this.gameHash,
    };
  }
}
