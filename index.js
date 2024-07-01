const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const { generateTable } = require('./services/generatetable');
const { staxAI } = require('./services/staxAI');
const { tegoCyberPdf } = require('./services/tegoCyberPdf');
const { generateHashTagByContext } = require('./services/generateHashTagByContext');
const { generateHashTagByHashtag } = require("./services/generateHashTagByHashtag")
const PORT = process.env.PORT || 8080
const { evisortRouter } = require('./routes/evisort.routes');

const app = express();


require('dotenv').config()

app.use(express.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Allow requests from all origins (for testing purposes)
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}));

  
/**
 * Routes
*/

app.get("/", (_, res) => {
    res.send("Project Working")
})

app.post("/create-table", generateTable)

app.get("/stax-ai", staxAI)


app.get("/tego-cyber-pdf", tegoCyberPdf)


app.post("/generate-hashtag-by-context", generateHashTagByContext)

app.post("/generate-hashtag-by-hashtag", generateHashTagByHashtag)


app.use("/evisort", evisortRouter)

app.listen(PORT, () => {
    console.log("Working on PORT ", PORT);
});
  

