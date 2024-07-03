import { Request ,Response } from "express";

export const getNewEvisortToken = async (req : Request, res : Response) => {
  const endpointUrl = "https://api.evisort.com/v1/auth/token";

  try {

    const API_KEY = process.env.EVISORT_API_KEY

    const resp = await fetch(endpointUrl, {
      method : "POST",
      //@ts-ignore
      headers : {
        "EVISORT-API-KEY": API_KEY,
      }
    });

    const { token } = await resp.json();
    
    res.status(200).json({
      success : true,
      token
    })
    
  } catch (error) {
    
    console.log({ error })
    res.status(400).json({
      success : false,
      error
    })
  }
}