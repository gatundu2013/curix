import { roundStateManager } from "./services/game/round-statemanager";

roundStateManager.generateRoundResults();

async function f() {
  await roundStateManager.incrementMultipliers();
  console.log("fully awaited");
}
f();
