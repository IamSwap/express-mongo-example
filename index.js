const express = require('express')
const app = express()
const port = 3000

const { MongoClient } = require("mongodb");

const dbClient = async () => {
  const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
  await client.connect()
  return client.db('twitter');
}

app.use(express.json());

app.get('/', async (req, res) => {
  const db = await dbClient();

  const tweets = await db.collection('tweets').find({}).toArray();

  return res.json(tweets)
})

app.post('/tweets', async (req, res) => {
  const db = await dbClient();
  const userExists = await db.collection('users').findOne({ username: req.body.username });

  if (!userExists) {
    return res.status(400).json({ message: `User with username: ${req.body.username} does not exists` });
  }

  const response = await db.collection('tweets').insertOne(req.body);
  const tweet = await db.collection('tweets').findOne({ _id: response.insertedId });

  res.json(tweet);
})

app.post('/register', async (req, res) => {
  const db = await dbClient();
  const userExists = await db.collection('users').findOne({ username: req.body.username });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const response = await db.collection('users').insertOne(req.body);
  const user = await db.collection('users').findOne({ _id: response.insertedId });

  return res.json(user);
})

app.get('/:username', async (req, res) => {
  const db = await dbClient();
  const user = await db.collection('users').findOne({ username: req.params.username });

  if (!user) {
    return res.status(400).json({ message: `User with username: ${req.params.username} does not exists` });
  }

  const tweets = await db.collection('tweets').find({ username: req.params.username }).toArray();

  return res.json(tweets)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
