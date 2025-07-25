import { Router } from "express";
import { authRouter } from "./auth.routes";

export const userRouter = Router();

userRouter.use("/auth", authRouter);
