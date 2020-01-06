import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import ElasticsearchService from "./services/ElasticsearchService";

const whitelist = ["https://castroom.co", "http://localhost:3000", "https://castroom.web.app", "https://castroom.firebaseapp.com"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Not allowed by CORS");
    }
  },
};

const es = new ElasticsearchService();

const app = express();
app.use(bodyParser.json());
app.use(helmet()); // sets security related HTTP response headers

app.get("/", cors(corsOptions), async (req, res) => {
  if (req && req.query.q) {
    es.search("trackName", req.query.q, 5).then((response) => {
      console.log(req.query.q);
      res.send(response);
    }).catch((err) => {
      console.log(err);
    });
  } else {
    res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
