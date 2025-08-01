import { RoundPhase } from "../../types/shared/game-types";
import { roundStateManager } from "./round-state-manager";

class RoundLifeCycleManager {
  private static instance: RoundLifeCycleManager;

  private constructor() {}

  public static getInstance(): RoundLifeCycleManager {
    if (!RoundLifeCycleManager.instance) {
      RoundLifeCycleManager.instance = new RoundLifeCycleManager();
    }
    return RoundLifeCycleManager.instance;
  }

  public beginLifeCycle() {}

  private bettingPhase() {
    roundStateManager.setRoundPhase(RoundPhase.BETTING);
  }

  private preparingPhase() {
    roundStateManager.setRoundPhase(RoundPhase.PREPARING);
    roundStateManager.generateRoundResults();
  }

  private runningPhase() {
    roundStateManager.setRoundPhase(RoundPhase.RUNNING);
    roundStateManager.incrementMultipliers();
  }

  private endPhase() {
    roundStateManager.setRoundPhase(RoundPhase.END);
  }
}

export const roundLifeCycleManager = RoundLifeCycleManager.getInstance();
