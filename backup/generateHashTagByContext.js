require('dotenv').config()
const axios = require('axios');


const generateHashTagByContext = async (req, res) => {
  const API_URL = `https://api.openai.com/v1/chat/completions`
  try {
    const { userInput } = req.body

    if (!userInput) throw new Error("No Input found")

    const API_KEY = process.env.HASHTAG_API_KEY
    if (!API_KEY) throw new Error('No API Key found')

    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      }
    }


    const prompt = `
            Generate Instagram hashtags for a post. The context of the post is  : ${userInput}
            The response should be in the format of hashtag name and the number of times it has been used on Instagram, similar to the following:

            #helloworld 16521323
            #heyy 13292183
            #something 38293484
            
            Don't include any text, answer in your reply. just the hashtags and the number of times it has been used. Give me atleast 15 such responses. Also sort it based on the number of times it has been used.
        `
    const payload = {
      "model": "gpt-3.5-turbo",
      temperature: 0.2,
      n: 1,
      "messages": [
        {
          "role": "assistant",
          "content": `${prompt}`
        },
      ]
    }
    const body = JSON.stringify(payload);

    try {
      const { data } = await axios.post(API_URL, body, requestOptions);
      const responseText = data.choices[0].message.content;
      return res.status(200).json({
        success: true,
        responseText
      });

    } catch (err) {
      let errMsg = err.response.data.error.message

      if (typeof errMsg === 'string' && errMsg.includes('reduce your prompt')) {
        throw new Error("Limit exceeded")
      }
      else throw new Error(errMsg)

    }

  } catch (error) {
    console.error("Error ", error.message)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = {
  generateHashTagByContext
}