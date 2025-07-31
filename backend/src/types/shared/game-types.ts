export enum RoundPhase {
  PREPARING = "preparing",
  RUNNING = "running",
  END = "end",
  BETTING = "betting",
  ERROR = "error",
}

export enum VehicleType {
  MATATU = "matatu",
  BODABODA = "bodaboda",
}

export enum VehicleStatus {
  IDLE = "idle",
  RUNNING = "running",
  CRASHED = "crashed",
}

export interface MultiplierDetails {
  finalMultiplier: number | null;
  rawMultiplier: number | null;
  normalizedHashValue: number | null;
  hashIntValue: number | null;
  clientSeed: string;
  serverSeed: string | null;
  serverSeedHash: string | null;
  combinedSeed: string | null;
  gameHash: string | null;
}
