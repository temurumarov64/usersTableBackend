const express = require("express");
const app = express();
const port = 4200;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const authorizationHandler = require("./handlers/authorization");
const db = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12622788",
  password: "ILFXtVtLI9",
  database: "sql12622788",
});

db.connect();

app.use(cors());

app.use(cookieParser());

app.use(bodyParser.json());

app.use(authorizationHandler(db));

app.get("/", (req, res) => {
  res.send(`Hello World! ${JSON.stringify(req.cookies)}`);
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
