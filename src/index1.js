var http = require("http");
var yahooFinance = require("yahoo-finance");
const cors = require("cors");
const express = require("express");
const home = require("./home");
const app = express();

app.use(cors());

app.use("/", home);

app.listen(8080, () => {
  console.log(`apppp is running on port 8080`);
});
