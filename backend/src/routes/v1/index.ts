import { Router } from "express";
import { authRouter } from "./auth/auth.routes";

export const v1Router = Router();

//........ GLOBAL ROUTES ...........
v1Router.use("/auth", authRouter);

//........ ADMIN ROUTES ...........
v1Router.use("/admin", () => {});
