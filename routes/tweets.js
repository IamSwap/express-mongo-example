var express = require("express");
var router = express.Router();
var dbClient = require("../utils/connection");

router.get("/", async (req, res) => {
  const db = await dbClient();
  const tweets = await db.collection("tweets").find({}).toArray();
  res.status(200).json(tweets);
});

router.post("/", async (req, res) => {
  const db = await dbClient();
  const userExists = await db
    .collection("users")
    .findOne({ username: req.body.username });
  if (!userExists) {
    return res.status(400).json({
      message: `User with username: ${req.body.username} does not exists`,
    });
  }
  const data = {
    body: req.body.body,
    username: req.body.username,
  };
  const response = await db.collection("tweets").insertOne(data);
  const tweet = await db
    .collection("tweets")
    .findOne({ _id: response.insertedId });

  res.json(tweet);
});

router.get("/:username", async (req, res) => {
  const db = await dbClient();
  const user = await db
    .collection("users")
    .findOne({ username: req.params.username });
  if (!user) {
    return res.status(400).json({
      message: `User with username: ${req.params.username} does not exists`,
    });
  }
  const tweets = await db
    .collection("tweets")
    .find({ username: req.params.username })
    .toArray();

  return res.json(tweets);
});

module.exports = router;
