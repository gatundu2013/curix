import { VEHICLE_TYPES } from "../../services/game/round-statemanager";

export enum RoundPhase {
  PREPARING = "preparing",
  RUNNING = "running",
  END = "end",
  BETTING = "betting",
  ERROR = "error",
}

export type VehicleType = (typeof VEHICLE_TYPES)[keyof typeof VEHICLE_TYPES];

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
