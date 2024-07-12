import { Request, Response } from "express";
import { handleError } from "../../utils";
import "dotenv/config";

/**
 * This has functions that deal with documents logic
 */
import cron from "node-cron";
import { getTokenFromEvisortAPI } from "./utils";

let cachedEvisortData = {};

let existingToken: string = "";

cron
  .schedule("0 * * * *", async () => {
    console.log("running every hour");

    const { success, message, token } = await getTokenFromEvisortAPI();

    existingToken = token;
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
    let authToken: string = "";

    if (existingToken) {
      authToken = existingToken;
    } else {
      const { success, message, token } = await getTokenFromEvisortAPI();
      if (!success) return;
      existingToken = token;
      authToken = token;
    }

    const resp = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    let data = await resp.json();

    if (data?.detail && data.detail.toLowerCase().includes("token")) {
      // means token related issue
      const { success, message, token } = await getTokenFromEvisortAPI();
      if (!success) return;
      existingToken = token;
      authToken = token;

      const resp = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      data = await resp.json();
    }

    cachedEvisortData = { ...data };
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
    let authToken: string = "";

    if (existingToken) {
      authToken = existingToken;
    } else {
      const { success, message, token } = await getTokenFromEvisortAPI();
      if (!success) return;
      authToken = token;
      existingToken = token;
    }

    let resp = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!resp.ok) {
      // probably token related issue
      const { success, message, token } = await getTokenFromEvisortAPI();
      existingToken = token;
      // re assigning resp
      resp = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    res.status(200).json({
      success: true,
      url: resp.url,
    });
  } catch (error) {
    handleError(error, res);
  }
};
