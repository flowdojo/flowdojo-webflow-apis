const axios = require('axios');

const tegoCyberPdf = async (req, res) =>
{
    try {
        const { data } = await axios.get("https://www.sec.gov/Archives/edgar/data/1815632/000165495423012445/0001654954-23-012445-index.htm")

        console.log("data ", data)

        res.status(200).json({
            success : true,
            data,
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            data : error.response.data
        })
        console.error("cyber error ", error.response.data)
    }
}


module.exports = {
    tegoCyberPdf
}