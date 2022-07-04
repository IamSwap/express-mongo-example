var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
var dbClient = require("../utils/connection");
const jwt = require("jsonwebtoken");

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

  const token = jwt.sign(
    { id: user._id, username: user.username, password: user.password },
    process.env.SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  const insertToken = await db.collection("tokens").insertOne({
    token: token,
    userId: user._id,
  });

  const findToken = await db.collection("tokens").findOne({
    _id: insertToken.insertedId,
  });

  return res
    .status(201)
    .cookie({ token: findToken.token }, { httpOnly: true })
    .json({ token: findToken.token });
});

module.exports = router;
