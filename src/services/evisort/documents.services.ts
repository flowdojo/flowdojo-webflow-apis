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

    const endpoint = "https://api.evisort.com/v1/search?page=1&pageSize=200";

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        query: [
          {
            type: "field",
            name: "Document Type",
            filter: "equals",
            terms: "Main Contract"
          }
        ]
      })
    });

    console.log({ resp });


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

  const endpoint = "https://api.evisort.com/v1/search?page=1&pageSize=200";

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
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: [
          {
            type: "field",
            name: "Document Type",
            filter: "equals",
            terms: "Main Contract",
          }
        ]
      })
    });

    let data = await resp.json();

    if (data?.detail && data.detail.toLowerCase().includes("token")) {
      // means token related issue
      const { success, message, token } = await getTokenFromEvisortAPI();
      if (!success) return;
      existingToken = token;
      authToken = token;

      const resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          query: [
            {
              type: "field",
              name: "Document Type",
              filter: "equals",
              terms: "Main Contract",
            },
          ],
        }),
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


export const getDownloadableDocuments = async (req: Request, res: Response) => {
  const endpoint = `https://api.evisort.com/v1/search?page=1&pageSize=200`;


  try {
    const contractId = req.query.contractId;
    if (!contractId) throw new Error("No Contract Id")

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
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "query": [
          {
            "type": "field",
            "name": "Main contract Evisort ID",
            "filter": "containstext",
            "terms": `${contractId}`
          }
        ]
      })
    });

    let data = await resp.json();

    if (data?.detail && data.detail.toLowerCase().includes("token")) {
      // means token related issue
      const { success, message, token } = await getTokenFromEvisortAPI();
      if (!success) return;
      existingToken = token;
      authToken = token;

      const resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          "query": [
            {
              "type": "field",
              "name": "Main contract Evisort ID",
              "filter": "containstext",
              "terms": `${contractId}`
            }
          ]
        }),
      });

      data = await resp.json();
    }

    res.status(200).json({
      success: true,
      documents: data.documents,
    });
  } catch (e: unknown) {
    handleError(e, res);
  }
}