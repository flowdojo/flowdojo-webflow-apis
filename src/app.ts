import express from "express";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import routes from "./routes";
import path from "path";



const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));


const corsOptions = {
  origin: '*', // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};



app.use(cors(corsOptions));


app.get("/", (_, res) => {
  res.json(`Project working on PORT ${PORT}`);
});

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Project working on PORT ${PORT}`);
});
