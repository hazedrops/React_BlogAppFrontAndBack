import express from 'express'
import { MongoClient } from 'mongodb'

// Temporary in-memory DB
// let articlesInfo = [
//   {
//     name: 'learn-react',
//     upvotes: 0,
//     comments: [],
//   },
//   {
//     name: 'learn-node',
//     upvotes: 0,
//     comments: [],
//   },
//   {
//     name: 'mongodb',
//     upvotes: 0,
//     comments: [],
//   },
// ]

// Create a new express app
const app = express()

// Middleware - When receives a request that has a JSON body (JSON payload), the middleware is going to parse the request and automatically make that available to us on request.body
app.use(express.json())

app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params

  const client = new MongoClient('mongodb://127.0.0.1:27017') // 27017: Default port for MongoDB

  await client.connect()

  const db = client.db('react-blog-db') // same as 'use react-blog-db'

  const article = await db.collection('articles').findOne({ name })

  if(article) {
    res.json(article)
  } else {
    res.sendStatus(404);
  }
})

app.put('/api/articles/:name/upvote', async(req, res) => {
  const { name } = req.params
 
  const client = new MongoClient('mongodb://127.0.0.1:27017')
  await client.connect()

  const db = client.db('react-blog-db')
  await db.collection('articles').updateOne({ name }, {
    $inc: { upvotes: 1 },
  })
  const article = await db.collection('articles').findOne({ name })

  if(article) {
    article.upvotes += 1;
    res.send(`The ${name} article now has ${article.upvotes} upvotes!!!`)
  } else {
    res.send('That article doesn\'t exist')
  }
})

app.post('/api/articles/:name/comments', (req, res) => {
  const { name } = req.params
  const { postedBy, text } = req.body

  const article = articlesInfo.find(a => a.name === name)

  if(article) {
    article.comments.push({ postedBy, text })
    res.send(article.comments)
  } else {
        res.send("That article doesn't exist")
  }
})

app.listen(8000, () => {
  console.log('Server is listening on port 8000!!!')
})
