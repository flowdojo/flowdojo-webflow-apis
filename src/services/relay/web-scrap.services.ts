import { Request, Response } from "express";
import { checkIfScriptPresentInSite, fetchSearchResults } from "./helpers";



export const sitesWithFareHarborScript = async (req: Request, res: Response) => {

  try {
    const searchTerm = req.query.searchTerm

    console.log(req.params)

    if (!searchTerm) throw new Error("No Search Term provided")

    const results = await fetchSearchResults(searchTerm as string, 100);

    const resp = await Promise.all(
      results.map(async (url) => {
        try {
          const scriptFound = await checkIfScriptPresentInSite(url);
          return { url, scriptFound };
        } catch (error) {
          return { url, scriptFound: false };
        }
      })
    );

    const urlsContainingScript = resp
      .filter((result) => result.scriptFound)
      .map((result) => result.url);




    res.status(200).json({
      success: true,
      urls: urlsContainingScript

    })



  } catch (error: any) {
    console.log({ error })


    res.status(404).json({
      success: false,
      message: error.response?.data?.message || error.message,
    })
  }



}