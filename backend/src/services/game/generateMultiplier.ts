import crypto from "crypto";

export class MultiplierGenerator {
  private static readonly GAME_HASH_SLICE_LEN = 13; // 13 hex chars = 6.5 bytes
  private static readonly HOUSE_EDGE = 0.02;
  private static readonly MAX_MULTIPLIER = 4000;
  private static readonly MIN_MULTIPLIER = 1;

  private serverSeed: string | null = null;
  private hashedServerSeed: string | null = null;
  private gameHash: string | null = null;
  private decimal: number | null = null;
  private normalizedValue: number | null = null;
  private rawMultiplier: number | null = null;
  private finalMultiplier: number | null = null;
  private clientSeed: string | null = null;

  // Generates a random base64 server seed and its for provable fairness
  private generateServerSeed(bytesLength = 24) {
    const serverSeed = crypto.randomBytes(bytesLength).toString("base64");
    const hashedServerSeed = crypto
      .createHash("sha256")
      .update(serverSeed)
      .digest("hex");

    this.serverSeed = serverSeed;
    this.hashedServerSeed = hashedServerSeed;
  }

  // Combines server and client seeds to produce a unique, deterministic game hash
  private generateHash(clientSeed: string) {
    if (!clientSeed || clientSeed.trim() === "") {
      throw new Error("Client seed cannot be empty");
    }

    if (!this.serverSeed) {
      throw new Error("Server seed was not generated");
    }

    const seedCombination = `${this.serverSeed}${clientSeed}`;
    const gameHash = crypto
      .createHash("sha256")
      .update(seedCombination)
      .digest("hex");

    this.gameHash = gameHash;
    this.clientSeed = clientSeed;
  }

  // Converts  game hash  to a multiplier
  private generateMultiplier() {
    if (!this.gameHash) {
      throw new Error("Game hash was not generated");
    }

    const slicedHash = this.gameHash.slice(
      0,
      MultiplierGenerator.GAME_HASH_SLICE_LEN
    );

    const numBytes = MultiplierGenerator.GAME_HASH_SLICE_LEN / 2; // 2 hex chars = 1 byte
    const numBits = numBytes * 8;
    const maxValue = Math.pow(2, numBits) - 1;

    const decimalValue = parseInt(slicedHash, 16);
    const normalizedValue = decimalValue / maxValue;

    // Inverse curve where low normalized values generate low multipliers,
    // and values close to 1 generate very high multipliers
    const rawMultiplier = 1 / (1 - normalizedValue);

    // Apply house edge
    const adjustedMultiplier =
      rawMultiplier * (1 - MultiplierGenerator.HOUSE_EDGE);

    // Clamp to min/max range
    const finalMultiplier = Math.min(
      MultiplierGenerator.MAX_MULTIPLIER,
      Math.max(MultiplierGenerator.MIN_MULTIPLIER, adjustedMultiplier)
    );

    this.decimal = decimalValue;
    this.normalizedValue = normalizedValue;
    this.rawMultiplier = rawMultiplier;
    this.finalMultiplier = finalMultiplier;
  }

  public generateResults(clientSeed: string) {
    this.generateServerSeed();
    this.generateHash(clientSeed);
    this.generateMultiplier();
  }

  public getGameDetails() {
    return {
      clientSeed: this.clientSeed,
      serverSeedHash: this.hashedServerSeed,
      decimal: this.decimal,
      gameHash: this.gameHash,
      normalizedValue: this.normalizedValue,
      rawMultiplier: this.rawMultiplier,
      finalMultiplier: this.finalMultiplier,
    };
  }
}
