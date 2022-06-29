const { MongoClient } = require("mongodb");

const dbClient = async () => {
  const client = new MongoClient(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  });
  await client.connect();
  return client.db(process.env.DATABASE_NAME);
};

module.exports = dbClient;
