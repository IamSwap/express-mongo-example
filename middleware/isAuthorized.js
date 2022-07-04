var dbClient = require("../utils/connection");

const isAuthorized = async (req, res, next) => {
  const db = await dbClient();
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const dbToken = await db.collection("tokens").findOne({ token: token });

  if (!dbToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const dbUser = await db.collection("users").findOne({ _id: dbToken.userId });

  if (!dbUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

module.exports = isAuthorized;
