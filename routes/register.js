var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
var dbClient = require("../utils/connection");

router.post("/", async (req, res) => {
  const db = await dbClient();
  const userExists = await db
    .collection("users")
    .findOne({ username: req.body.username });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hashSync(req.body.password, 10);

  const data = {
    username: req.body.username,
    email: req.body.email,
    password: passwordHash,
  };

  const response = await db.collection("users").insertOne(data);
  const user = await db
    .collection("users")
    .findOne({ _id: response.insertedId });

  return res.json(user);
});

module.exports = router;
