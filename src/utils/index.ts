import { Response } from "express";

export const handleError = (err: unknown, res: Response) => {
  let error: string = "";
  if (err instanceof Error) {
    error = err.message;
  }
  return res.status(403).json({
    success: false,
    error,
  });
};
