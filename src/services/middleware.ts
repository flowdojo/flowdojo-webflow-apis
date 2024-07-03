import { Request, Response, NextFunction } from "express"

export const evisortTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const token = req.headers.authorization?.split(" ")[1]

  if (token) next()

  else {
    return res.status(401).json({
      success: false,
      message: 'Token not found'
    })
  }
  
}