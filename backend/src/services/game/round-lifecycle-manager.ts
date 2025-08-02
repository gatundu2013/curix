import { RoundPhase } from "../../types/shared/game-types";
import { roundStateManager } from "./round-state-manager";

class RoundLifeCycleManager {
  private static instance: RoundLifeCycleManager;
  private isLifecycleRunning = false;

  private static readonly CONFIG = {
    BETTING_DURATION_MS: 5000,
    END_DURATION_MS: 2000,
    COUNTDOWN_INTERVAL_MS: 100,
  };

  private constructor() {}

  public static getInstance(): RoundLifeCycleManager {
    if (!RoundLifeCycleManager.instance) {
      RoundLifeCycleManager.instance = new RoundLifeCycleManager();
    }
    return RoundLifeCycleManager.instance;
  }

  /**
   * Starts the infinite round lifecycle loop:
   * Betting → Preparing → Running → End
   */
  public async startLifecycle() {
    if (this.isLifecycleRunning) {
      console.log("[RoundLifeCycleManager]: Lifecycle is already running");
      return;
    }

    this.isLifecycleRunning = true;

    while (true) {
      try {
        await this.runBettingPhase();
        await this.runPreparingPhase();
        await this.runRunningPhase();
        await this.runEndPhase();
      } catch (err) {
        this.isLifecycleRunning = false;
        console.error("[RoundLifeCycleManager]: Lifecycle error:", err);
        throw new Error("Round lifecycle failed");
      }
    }
  }

  /**
   * Phase 1: Allow players to place bets for the given window
   */
  private async runBettingPhase() {
    roundStateManager.setRoundPhase(RoundPhase.BETTING);

    let remainingTimeMs = RoundLifeCycleManager.CONFIG.BETTING_DURATION_MS;

    while (remainingTimeMs > 0) {
      // TODO: Emit remaining time to all users
      console.log(`[Betting Phase] Remaining time: ${remainingTimeMs / 1000}s`);
      await new Promise((resolve) =>
        setTimeout(resolve, RoundLifeCycleManager.CONFIG.COUNTDOWN_INTERVAL_MS)
      );
      remainingTimeMs -= RoundLifeCycleManager.CONFIG.COUNTDOWN_INTERVAL_MS;
    }
  }

  /**
   * Phase 2: Prepare the round's outcome using provably fair logic
   */
  private async runPreparingPhase() {
    roundStateManager.setRoundPhase(RoundPhase.PREPARING);
    roundStateManager.generateRoundResults();
  }

  /**
   * Phase 3: Begin multiplier growth until vehicles crash
   */
  private async runRunningPhase() {
    roundStateManager.setRoundPhase(RoundPhase.RUNNING);
    await roundStateManager.incrementMultipliers();
  }

  /**
   * Phase 4: Conclude the round and wait before starting a new one
   */
  private async runEndPhase() {
    roundStateManager.setRoundPhase(RoundPhase.END);
    console.log("[RoundLifeCycleManager]: Round ended");
    await new Promise((resolve) =>
      setTimeout(resolve, RoundLifeCycleManager.CONFIG.END_DURATION_MS)
    );
  }
}

export const roundLifeCycleManager = RoundLifeCycleManager.getInstance();
