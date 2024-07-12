import { Request, Response } from "express";
import { getTokenFromHeader, handleError } from "../../utils";
import "dotenv/config";

/**
 * This has functions that deal with documents logic
 */
import cron from "node-cron";
import { getTokenFromEvisortAPI } from "./utils";

let cachedEvisortData = {};

cron
  .schedule("0 * * * *", async () => {
    console.log("running every hour");

    const { success, message, token } = await getTokenFromEvisortAPI();

    if (!success) return;

    const endpoint =
      "https://api.evisort.com/v1/documents?page=1&pageSize=100&modifiedSince=2024-05-22T10:41:02.577Z&includeClauses=true";

    const resp = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await resp.json();

    if (data?.detail && data.detail.toLowerCase().includes("token")) {
      // means token related issue
      return;
    }

    cachedEvisortData = { ...data };
  })
  .now();

export const getAllDocuments = async (req: Request, res: Response) => {
  if (Object.keys(cachedEvisortData).length > 0) {
    console.log("returning data from Cache");

    return res.status(200).json({
      success: true,
      data: cachedEvisortData,
    });
  }

  const endpoint =
    "https://api.evisort.com/v1/documents?page=1&pageSize=100&modifiedSince=2024-05-22T10:41:02.577Z&includeClauses=true";

  try {
    const token = getTokenFromHeader(req) as string;

    const resp = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await resp.json();

    if (data?.detail && data.detail.toLowerCase().includes("token")) {
      // means token related issue
      throw new Error("Token Expired");
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (e: unknown) {
    handleError(e, res);
  }
};

export const downloadDocument = async (req: Request, res: Response) => {
  const idValue = req.params.id;
  const endpoint = `https://api.evisort.com/v1/documents/${idValue}/content`;

  try {
    const token = getTokenFromHeader(req);
    const resp = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resp.ok) {
      throw new Error("Something went wrong");
    }

    res.status(200).json({
      success: true,
      url: resp.url,
    });
  } catch (error) {
    handleError(error, res);
  }
};
