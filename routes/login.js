var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
var dbClient = require("../utils/connection");

router.post("/", async (req, res) => {
  const db = await dbClient();

  const user = await db
    .collection("users")
    .findOne({ username: req.body.username });

  if (!user) {
    return res.status(400).json({ message: "User doesn't exists" });
  }

  const verified = await bcrypt.compareSync(user.password, req.body.password);

  if (verified) {
    return res.status(403).json({ message: "password did not match!" });
  }

  const response = await db
    .collection("users")
    .findOne({ username: user.username });

  const token = await db.collection("tokens").findOne({
    userId: response._id,
  });

  return res.status(200).json({ token: token.token });
});

module.exports = router;
