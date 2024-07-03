const { getTokenFromHeader } = require("../utils/token");

const getAllEvisortDocuments = async (req, res) => {
  const endpoint = 'https://api.evisort.com/v1/documents?page=1&pageSize=100&modifiedSince=2024-05-22T10:41:02.577Z&includeClauses=true'


  
  try {
    const token = getTokenFromHeader(req)
    const resp = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await resp.json()
    
    if (data?.detail && data.detail.toLowerCase().includes("token")) { 
      // means token related issue
      throw new Error("Token Expired")
    }
  
    res.status(200).json({
      success : true,
      data
    })
  
  } catch (error) {
    console.log({ error });
    return res.status(403).json({
      success : false,
      error: error?.response?.data?.message || error.message,
    });
  }
}





const getEvisortDocumentDownloadLink = async (req, res) => {

  const idValue = req.params.id
  const endpoint = `https://api.evisort.com/v1/documents/${idValue}/content`
  
  try {
    const token = getTokenFromHeader(req)
    const resp = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resp.ok) {
      throw new Error("Something went wrong")
    }
  
    res.status(200).json({
      success : true,
      url : resp.url
    })
  
  } catch (error) {
    console.log({ error });
    return res.status(403).json({
      success : false,
      error: error?.response?.data?.message || error.message,
    });
  }
}


module.exports = {
  getAllEvisortDocuments,
  getEvisortDocumentDownloadLink
}
