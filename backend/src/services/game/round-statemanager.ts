import { VehicleType } from "../../types/shared/game-types";
import { MultiplierGenerator } from "./multiplier/multiplierGenerator";
import { Vehicle } from "./vehicle";

interface ClientSeedDetails {
  clientSeed: string;
  contributors: { id: string; seed: string }[];
}

export class RoundStateManager {
  private static instance: RoundStateManager;

  private readonly vehicleMultipliers: Record<VehicleType, Vehicle | null>;
  private readonly vehicleClientSeeds: Record<
    VehicleType,
    ClientSeedDetails | null
  >;

  private constructor() {
    this.vehicleClientSeeds = {
      [VehicleType.BODABODA]: null,
      [VehicleType.MATATU]: null,
    };

    this.vehicleMultipliers = {
      [VehicleType.BODABODA]: null,
      [VehicleType.MATATU]: null,
    };
  }

  public static getInstance(): RoundStateManager {
    if (!RoundStateManager.instance) {
      RoundStateManager.instance = new RoundStateManager();
    }
    return RoundStateManager.instance;
  }

  /**
   * Generates round results for all vehicles in the multipliers record
   */
  public generateRoundResults(): void {
    for (const vehicleKey of Object.keys(this.vehicleMultipliers)) {
      const vehicleType = vehicleKey as VehicleType;

      // Runtime validation to ensure data integrity
      if (!Object.values(VehicleType).includes(vehicleType)) {
        throw new Error(
          `Invalid vehicle type found in multipliers: ${vehicleKey}`
        );
      }

      // Use client seed if provided, otherwise use default seed pattern
      const defaultClientSeed = `curix2013-${vehicleType}`;
      const objEntry = this.vehicleClientSeeds[vehicleType as VehicleType];
      const clientSeed = objEntry?.clientSeed ?? defaultClientSeed;

      // Generate new vehicle with multiplier for this round
      const multiplierGenerator = new MultiplierGenerator(clientSeed);
      const vehicleDetails = new Vehicle({
        multiplierGenerator,
        vehicleType,
      });

      // Update the vehicle multiplier with the new result
      this.vehicleMultipliers[vehicleType] = vehicleDetails;
    }
  }
}

export const roundStateManager = RoundStateManager.getInstance();
