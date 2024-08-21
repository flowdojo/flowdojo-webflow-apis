import { google } from "googleapis"
import axios from "axios"
import cheerio from "cheerio"



export const fetchSearchResults = async (searchTerm: string, numOfResults = 100) => {

  const CUSTOM_SEARCH_ENGINE_ID = process.env.CUSTOM_SEARCH_ENGINE_ID;
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

  const customSearch = google.customsearch("v1");

  let startIndex = 1;
  let results: string[] = [];

  while (results.length <= numOfResults) {
    console.log("loop start");

    const res = await customSearch.cse.list({
      cx: CUSTOM_SEARCH_ENGINE_ID,
      q: searchTerm.trim(),
      auth: GOOGLE_API_KEY,
      num: 10, // Google API returns a maximum of 10 results per request
      start: startIndex,
    });

    if (res.data.items) {
      results = results.concat(res.data.items.map((item) => item.link ? item.link : ""));
      startIndex += res.data.items.length;
    } else {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
};


export const checkIfScriptPresentInSite = async (siteUrl: string) => {

  const scriptToSearch = "https://fareharbor.com/embeds/api/v1/";


  try {
    const response = await axios.get(siteUrl);

    const $ = cheerio.load(response.data);

    const scriptTags = $("script");

    let scriptFound = false;

    scriptTags.each((i, script) => {
      if (
        $(script).html()?.includes(scriptToSearch) ||
        $(script).attr("src")?.includes(scriptToSearch)
      ) {
        scriptFound = true;
      }
    });

    return scriptFound;
  } catch (error) {
    return false;
  }
}



export const removeDuplicateUrls = (urls: string[]): string[] => {
  const seenDomains = new Set();
  return urls.filter(url => {
    const domain = getDomain(url);
    if (seenDomains.has(domain)) {
      return false;
    } else {
      seenDomains.add(domain);
      return true;
    }
  });
}



function getDomain(url: string) {

  if (url === "") return ""
  const urlObj = new URL(url);
  return urlObj.hostname;
}
