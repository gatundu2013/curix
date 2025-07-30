import { MultiplierSimulator } from "./services/game/multiplier/multiplierSimulator";

const multiplierSimulator = new MultiplierSimulator();

console.log(multiplierSimulator.simulateDistribution(1000));
