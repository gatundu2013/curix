import { Router } from "express";
import { AuthController } from "../../../controllers/v1/auth/auth.controller";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.post("/request-otp", authController.requestOtp);
authRouter.post("/logout", authController.logout);
