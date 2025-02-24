import axios from "axios";
import { Request, Response } from "express";

const API_KEY = process.env.MTALKZ_API_KEY
const SENDER_ID = process.env.MTALKZ_SENDER_IT


export const sendOtp = async (req : Request, res : Response) => {
  try {
    const { number } = req.body as {
      number : string
    };
    if (!number) {
      return res.status(400).json({ error: "Number is required" });
    }

    const response = await axios.post(
      "https://msg.mtalkz.com/V2/http-api-sms.php",
      {
        apikey: API_KEY,
        senderid: SENDER_ID,
        number,
        message:
          "Your OTP for the Treats Challenge is {OTP}. Please do not share this OTP with anyone. Team Britannia",
        format: "json",
        digit: "4", // Updated to match cURL request
        otptimeout: "120",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("Response ", response.data);
    res.status(200).json(response.data);
  } catch (error : any) {

    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}

export const verifyOtp = async (req : Request, res : Response) => {
  try {
    const { sessionid, otp } = req.body as {
      sessionid : string
      otp : string
    };
    if (!sessionid || !otp) {
      return res.status(400).json({ error: "Session ID and OTP are required" });
    }

    const response = await axios.post(
      "http://msg.mtalkz.com/V2/http-verifysms-api.php",
      {
        apikey: API_KEY,
        sessionid,
        otp,
        format: "json",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    res.status(200).json(response.data);
  } catch (error : any) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}