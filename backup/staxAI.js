const axios = require('axios');

const staxAI = async (req, res) =>
{

    try {
        const { data } = await axios.get("https://api.stax.ai/misc/asOfToday")

        return res.status(200).json({
            success : true,
            data
        })
    } catch (error) {
        res.status(400).json({
            success : false,
            message : error.message
        })
        console.error("error occured ", error);
        
    }

}

module.exports = {
    staxAI
}