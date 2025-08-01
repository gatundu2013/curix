import {
  MultiplierDetails,
  VehicleStatus,
  VehicleType,
} from "../../types/shared/game-types";
import { MultiplierGenerator } from "./multiplier/multiplierGenerator";

interface VehicleConstructorParams {
  vehicleType: VehicleType;
  multiplierGenerator: MultiplierGenerator;
}

export class Vehicle {
  private static readonly MULTIPLIER_GROWTH_RATE = 0.004;

  private type: VehicleType;
  private status: VehicleStatus;
  private multiplierDetails: MultiplierDetails;
  private currentMultiplier: number;
  private finalMultiplier: number;

  constructor(params: VehicleConstructorParams) {
    const { vehicleType, multiplierGenerator } = params;

    this.status = VehicleStatus.IDLE;
    this.type = vehicleType;

    // Generate multiplier details for this vehicle instance
    this.multiplierDetails = multiplierGenerator.getMultiplierDetails();
    this.finalMultiplier = this.multiplierDetails.finalMultiplier!;
    this.currentMultiplier = 1;
  }

  public incrementMultiplier() {
    const growth = this.currentMultiplier * Vehicle.MULTIPLIER_GROWTH_RATE;
    const newMultiplier = this.currentMultiplier + growth;

    // Final multiplier has been attained - end
    if (newMultiplier >= this.finalMultiplier) {
      this.currentMultiplier = this.finalMultiplier;
      this.status = VehicleStatus.CRASHED;
      return;
    }

    this.currentMultiplier = newMultiplier;
    this.status = VehicleStatus.RUNNING;
  }

  public setStatus(status: VehicleStatus) {
    this.status = status;
  }

  public getStatus() {
    return this.status;
  }

  public getCurrentMultiplier() {
    return this.currentMultiplier;
  }
}
