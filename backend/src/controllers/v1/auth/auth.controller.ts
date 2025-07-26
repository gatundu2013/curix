import { Request, Response } from "express";
import { AuthService } from "../../../services/auth/auth.service";
import { registerSchema, requestOtpSchema } from "../../../validations";
import { setCookies } from "../../../utils";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      console.log(req.body);
      const payload = registerSchema.safeParse(req.body);

      // console.log(payload);

      if (payload.error) {
        throw new Error(payload.error.message);
      }

      const registerRes = await authService.register(payload.data);
      const { authTokens, userData, message } = registerRes;

      setCookies({
        res,
        accessToken: authTokens.accessToken,
        refreshToken: authTokens.refreshToken,
      });

      res.status(200).json({ message, userData });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "An error occured" });
    }
    console.log("Register controller");
  }

  async requestOtp(req: Request, res: Response) {
    try {
      const payload = requestOtpSchema.safeParse(req.body);

      if (payload.error) {
        throw new Error(payload.error.issues[0].message);
      }

      const response = await authService.requestOtp(req.body);

      res.status(200).json({ message: response.message });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
      console.log(err.message);
    }
  }

  async login(req: Request, res: Response) {
    console.log("Login controller");
  }

  async resetPassword(req: Request, res: Response) {
    console.log("Reset Password controller");
  }

  async logout(req: Request, res: Response) {
    console.log("Logout controller");
  }
}
