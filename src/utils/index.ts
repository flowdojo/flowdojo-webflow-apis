import { Request, Response } from "express";

export const getTokenFromHeader = (req : Request) =>  req.headers.authorization?.split(" ")[1]


export const handleError = (err : unknown, res : Response) => {
  let error : string = ""
  if (err instanceof Error) {
    error = err.message
  }
  return res.status(403).json({
    success : false,
    error
  });
}