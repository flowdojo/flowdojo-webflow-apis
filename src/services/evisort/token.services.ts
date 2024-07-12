import { Request, Response } from "express";
import { getTokenFromEvisortAPI } from "./utils";

export const getNewEvisortToken = async (_: Request, res: Response) => {
  try {
    const { success, message, token } = await getTokenFromEvisortAPI();

    if (!success) throw new Error(message);

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.log({ error });
    res.status(400).json({
      success: false,
      error,
    });
  }
};
