const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const { generateTable } = require('./services/generatetable');
const PORT = process.env.PORT || 8080


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
app.get('/',(_, res) => {
    res.json("Project working")
   
});

app.post("/create-table", generateTable)


app.listen(PORT, () => {
    console.log("Working on PORT ", PORT);
});
  

