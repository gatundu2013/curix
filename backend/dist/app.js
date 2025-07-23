"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
async function startServer() {
    try {
        app.listen(4000, () => {
            console.log(`The server is listening on port:${4000}`);
        });
    }
    catch (err) {
        console.log("Failed to start the server:", err);
        process.exit(1);
    }
}
