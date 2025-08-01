import { roundStateManager } from "./services/game/round-state-manager";

roundStateManager.generateRoundResults();

async function f() {
  await roundStateManager.incrementMultipliers();
  console.log("fully awaited");
}
f();
