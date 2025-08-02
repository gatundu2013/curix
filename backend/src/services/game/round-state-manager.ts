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

    // Initialize all vehicle-related data structures
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
      // Use provided client seed if available, otherwise use default
      const defaultClientSeed = `curix2013-${vehicleType}`;
      const providedClientSeed =
        this.vehicleClientSeeds[vehicleType]?.clientSeed;
      const clientSeed = providedClientSeed || defaultClientSeed;

      // Create multiplier generator and vehicle instance
      const multiplierGenerator = new MultiplierGenerator(clientSeed);
      const newVehicle = new Vehicle({
        multiplierGenerator,
        vehicleType,
      });

      // Store the vehicle for this round
      this.vehicleMultipliers[vehicleType] = newVehicle;
    }
  }

  /**
   * Increments multipliers until all vehicles crash.
   * Emits multiplier and status updates for each vehicle during each tick.
   */
  public async incrementMultipliers(): Promise<void> {
    return new Promise((resolve) => {
      const gameLoop = () => {
        // Get all vehicle entries for processing
        const vehicleEntries = Object.entries(this.vehicleMultipliers) as [
          VehicleType,
          Vehicle
        ][];

        // Prepare result object to emit updates
        const emitResults: Record<
          VehicleType,
          { currentMultiplier: number; status: VehicleStatus }
        > = {} as Record<
          VehicleType,
          { currentMultiplier: number; status: VehicleStatus }
        >;

        // Process each vehicle in this game tick
        for (const [vehicleType, vehicle] of vehicleEntries) {
          if (!vehicle) {
            continue; // Skip if vehicle doesn't exist
          }

          const currentStatus = vehicle.getStatus();
          const hasAlreadyCrashed = currentStatus === VehicleStatus.CRASHED;
          const crashHasBeenHandled = this.hasCrashedBeenHandled[vehicleType];

          // Only increment if vehicle is still running OR crash happened but hasn't been handled yet
          if (!hasAlreadyCrashed || !crashHasBeenHandled) {
            vehicle.incrementMultiplier();

            // Check if vehicle just crashed on this increment
            const statusAfterIncrement = vehicle.getStatus();
            const justCrashed = statusAfterIncrement === VehicleStatus.CRASHED;

            if (justCrashed) {
              this.hasCrashedBeenHandled[vehicleType] = true;
            }
          }

          // Collect current state for emission
          emitResults[vehicleType] = {
            currentMultiplier: vehicle.getCurrentMultiplier(),
            status: vehicle.getStatus(),
          };
        }

        // Check if any vehicles are still running (game should continue)
        const hasRunningVehicles = vehicleEntries.some(([, vehicle]) => {
          return vehicle?.getStatus() === VehicleStatus.RUNNING;
        });

        // TODO: Replace with real emit to clients
        console.log(
          "Emit vehicle update:",
          emitResults.bodaboda.currentMultiplier.toFixed(4),
          emitResults.matatu.currentMultiplier.toFixed(4)
        );

        if (hasRunningVehicles) {
          // Continue the game loop - schedule next tick
          this.multiplierLoopTimeout = setTimeout(gameLoop, 100);
        } else {
          // All vehicles have crashed - end the round
          this.cleanupGameLoop();
          resolve();
        }
      };

      // Start the game loop
      gameLoop();
    });
  }

  /**
   * Helper method to cleanup the game loop timeout
   */
  private cleanupGameLoop(): void {
    if (this.multiplierLoopTimeout) {
      clearTimeout(this.multiplierLoopTimeout);
      this.multiplierLoopTimeout = null;
    }
  }

  public setRoundPhase(roundPhase: RoundPhase): void {
    this.roundPhase = roundPhase;
  }
}

export const roundStateManager = RoundStateManager.getInstance();
