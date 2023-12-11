require('dotenv').config()
const axios = require('axios');


const generateHashTagByContext = async (req, res) =>
{
    const API_URL = `https://api.openai.com/v1/engines/text-davinci-003/completions`
    try {
        const { userInput } = req.body

        if(!userInput) throw new Error("No Input found")

        const API_KEY = process.env.HASHTAG_API_KEY
        if (!API_KEY) throw new Error('No API Key found')

        const requestOptions = {
            headers : {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            }
        }


        const prompt = `
            Generate Instagram hashtags for a post. The context of the post is  : ${userInput}
            The response should be in the format of hashtag name and the number of times it has been used on Instagram, similar to the following:

            #helloworld 16500000
            #heyy 1200000
            #something amazing 3700000
            
            Don't include any text, answer in your reply. just the hashtags and the number of times it has been used. Give me atleast 15 such responses
        `
        const payload = {
            prompt,
            temperature: 0.2,
            max_tokens: 3800,
            n: 1,
        }
        const body = JSON.stringify(payload);

        try {
            const { data } = await axios.post(API_URL, body, requestOptions);
            console.log("data ", data)
            const responseText = data.choices[0].text.trim();
            return res.status(200).json({
                success : true,
                responseText
            });

        } catch (err) {
            let errMsg = err.response.data.error.message

            if (typeof errMsg === 'string' && errMsg.includes('reduce your prompt')) 
            {
                throw new Error("Limit exceeded")
            } 
            else throw new Error(errMsg)
            
        }

    } catch (error) {
        console.error("Error ", error.message)
        return res.status(500).json({
            success : false,
            error : error.message
        })
    }
}

module.exports = {
    generateHashTagByContext
}