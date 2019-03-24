const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
//const logger = require("morgan");
const Data = require("./data");
const cors = require("cors");

const API_PORT = 3001;
const app = express();
const router = express.Router();
// app.use(cors);

// this is our MongoDB database
const dbRoute =
  "mongodb+srv://tunedinout:110%25Real@cluster0-8jzug.mongodb.net/test";

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.options("*", cors());
//app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  //console.log(req);
  console.log(req.hostname);
  // console.log(req.path);
  // console.log(req.subdomains);
  console.log(req.originalUrl);
  Data.find((err, data) => {
    //console.log(data);
    if (err) return res.json({ success: false, error: err });
    {
      res.setHeader("Access-Control-Allow-origin", "http://localhost:3000");

      return res.json({ success: true, data: data });
    }
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    res.setHeader("Access-Control-Allow-origin", "http://localhost:3000");
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  res.setHeader("Access-Control-Allow-origin", "http://localhost:3000");
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", cors(), (req, res) => {
  res.setHeader("Access-Control-Allow-origin", "http://localhost:3000");
  let data = new Data();

  //console.log(req);
  const { id, message } = req.body;
  // console.log(id, "", message);

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests

app.use("/api", router);

//app.use(cors({ "Access-Control-Allow-Origin": "*" }));

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
