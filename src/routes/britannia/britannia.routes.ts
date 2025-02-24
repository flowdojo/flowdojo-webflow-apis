import { Response, Router } from "express";
import { sendOtp, verifyOtp } from "../../services/britannia/otp.services";

export const britanniaRouter = Router()

britanniaRouter.get("/", (_, res : Response) => {
  res.status(200).json({
    message : "Hello britannia"
  })
})


britanniaRouter.post("/send-otp", sendOtp)
britanniaRouter.post("/verify-otp", verifyOtp)
