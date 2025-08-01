import {
  RoundPhase,
  VehicleStatus,
  VehicleType,
} from "../../types/shared/game-types";
import { MultiplierGenerator } from "./multiplier/multiplierGenerator";
import { Vehicle } from "./vehicle";

interface ClientSeedDetails {
  clientSeed: string;
  contributors: { id: string; seed: string }[];
}

export const VEHICLE_TYPES = {
  BODABODA: "bodaboda",
  MATATU: "matatu",
} as const;

export class RoundStateManager {
  private static instance: RoundStateManager;

  private roundPhase: RoundPhase;
  private readonly vehicleMultipliers: Record<VehicleType, Vehicle | null>;
  private readonly vehicleClientSeeds: Record<
    VehicleType,
    ClientSeedDetails | null
  >;
  private readonly hasCrashedBeenHandled: Record<VehicleType, boolean>;
  private multiplierLoopTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    this.roundPhase = RoundPhase.PREPARING;

    this.vehicleClientSeeds = {
      [VEHICLE_TYPES.BODABODA]: null,
      [VEHICLE_TYPES.MATATU]: null,
    };

    this.vehicleMultipliers = {
      [VEHICLE_TYPES.BODABODA]: null,
      [VEHICLE_TYPES.MATATU]: null,
    };

    this.hasCrashedBeenHandled = {
      [VEHICLE_TYPES.BODABODA]: false,
      [VEHICLE_TYPES.MATATU]: false,
    };
  }

  public static getInstance(): RoundStateManager {
    if (!RoundStateManager.instance) {
      RoundStateManager.instance = new RoundStateManager();
    }
    return RoundStateManager.instance;
  }

  /**
   * Generates initial round data for each vehicle based on provided or fallback client seeds
   */
  public generateRoundResults(): void {
    const vehicleTypes = Object.keys(this.vehicleMultipliers) as VehicleType[];

    for (const vehicleType of vehicleTypes) {
      const defaultClientSeed = `curix2013-${vehicleType}`;
      const objEntry = this.vehicleClientSeeds[vehicleType];
      const clientSeed = objEntry?.clientSeed ?? defaultClientSeed;

      const multiplierGenerator = new MultiplierGenerator(clientSeed);
      const vehicleDetails = new Vehicle({
        multiplierGenerator,
        vehicleType,
      });

      this.vehicleMultipliers[vehicleType] = vehicleDetails;
    }
  }

  /**
   * Increments multipliers until all vehicles crash.
   * Emits multiplier and status updates for each vehicle during each tick.
   */
  public async incrementMultipliers(): Promise<void> {
    return new Promise((resolve) => {
      const loop = () => {
        const vehicleEntries = Object.entries(this.vehicleMultipliers) as [
          VehicleType,
          Vehicle
        ][];

        const emitRes: Record<
          VehicleType,
          { currentMultiplier: number; status: VehicleStatus }
        > = {} as any;

        for (const [vehicleType, vehicle] of vehicleEntries) {
          if (!vehicle) continue;

          const status = vehicle.getStatus();

          // Increment multiplier only if vehicle has not crashed
          const shouldIncrement =
            status !== VehicleStatus.CRASHED ||
            this.hasCrashedBeenHandled[vehicleType];

          if (shouldIncrement) {
            vehicle.incrementMultiplier();

            // If this call crashed the vehicle, mark it
            if (vehicle.getStatus() === VehicleStatus.CRASHED) {
              this.hasCrashedBeenHandled[vehicleType] = true;
            }
          }

          // Update emitted state
          emitRes[vehicleType] = {
            currentMultiplier: vehicle.getCurrentMultiplier(),
            status: vehicle.getStatus(),
          };
        }

        // Checks if all Vehicles/multipliers have crashed
        const anyRunning = vehicleEntries.some(
          ([, vehicle]) => vehicle?.getStatus() === VehicleStatus.RUNNING
        );

        // TODO: Replace with real emit
        console.log("Emit vehicle update:", emitRes);

        // A vehicle is still running - loop continues
        if (anyRunning) {
          this.multiplierLoopTimeout = setTimeout(loop, 100);
          return;
        }

        // Round ends - All vehicles have crashed
        if (this.multiplierLoopTimeout) {
          clearTimeout(this.multiplierLoopTimeout);
          this.multiplierLoopTimeout = null;
        }
        resolve();
      };

      loop();
    });
  }

  public setRoundPhase(roundPhase: RoundPhase) {
    this.roundPhase = roundPhase;
  }
}

export const roundStateManager = RoundStateManager.getInstance();
