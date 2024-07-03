import express from "express";
import cors from "cors"
import bodyParser from "body-parser";


import routes from "./routes";

const PORT = process.env.PORT || 8080
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors())



app.get('/', (_, res) => {
  res.json(`Project working on PORT ${PORT}`)
});


app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Project working on PORT ${PORT}`)
})