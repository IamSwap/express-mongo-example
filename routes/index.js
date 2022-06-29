var express = require("express");
var router = express.Router();
var dbClient = require("../utils/connection");

require("dotenv").config();

router.get("/", async (req, res) => {
  const db = await dbClient();
  const tweets = await db.collection("tweets").find({}).toArray();
  res.status(200).json(tweets);
});

module.exports = router;
