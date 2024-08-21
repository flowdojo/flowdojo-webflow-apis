import { Request, Response } from "express";
import { checkIfScriptPresentInSite, fetchSearchResults, removeDuplicateUrls } from "./helpers";

import fs from "fs";
import path from "path"



export const sitesWithFareHarborScript = async (req: Request, res: Response) => {

  const filePath = path.join(__dirname, "scrape-data.json");


  try {
    fs.readFile(filePath, { encoding: "utf-8" }, async (err, data) => {

      if (err) console.log({ failedToReadFile: err });


      const searchTerm = req.query.searchTerm;

      if (!searchTerm) throw new Error("No Search Term provided")

      const results = await fetchSearchResults(searchTerm as string, 30);

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

      let urlsContainingScript = resp
        .filter((result) => result.scriptFound)
        .map((result) => result.url);

      // const key = searchTerm as string

      let existingData = JSON.parse(data);

      if (existingData && Array.isArray(existingData)) {
        urlsContainingScript = [...existingData, "", ...urlsContainingScript]
      } else {
        existingData = []
      }

      // console.log("existingData ", existingData)

      const uniqueUrls = removeDuplicateUrls(urlsContainingScript)

      existingData = removeEmptyString(uniqueUrls);

      let dataToSave = JSON.stringify(existingData)
      // save final data to json file

      if (uniqueUrls && uniqueUrls.length > 0) {
        fs.writeFile(filePath, dataToSave, (err) => {
          if (err) {
            console.log({ writeFileErr: err });
          }
          console.log("JSON File Created");
        });
      }

      res.status(200).json({
        success: true,
        urls: uniqueUrls

      })
    })

  } catch (error: any) {
    console.log({ error })

    return res.status(404).json({
      success: false,
      message: error.response?.data?.message || error.message,
    })
  }
}




function removeEmptyString(arr: string[]) {

  const array = [...arr]
  var i = 0;
  while (i < array.length) {
    if (array[i] === "") {
      array.splice(i, 1);
    } else {
      ++i;
    }
  }
  return array;
}