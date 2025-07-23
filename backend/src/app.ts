import express from "express";

const app = express();

async function startServer() {
  try {
    app.listen(4000, () => {
      console.log(`The server is listening on port:${4000}`);
    });
  } catch (err) {
    console.log("Failed to start the server:", err);
    process.exit(1);
  }
}

export { startServer };
