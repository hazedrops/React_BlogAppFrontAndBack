import express from 'express'
import { db, connectToDb } from './db.js' // Need to include '.js' when "type":"module" is used in package.json

// Create a new express app
const app = express()

// Middleware - When receives a request that has a JSON body (JSON payload), the middleware is going to parse the request and automatically make that available to us on request.body
app.use(express.json())

app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params

  const article = await db.collection('articles').findOne({ name })

  if (article) {
    res.json(article)
  } else {
    res.sendStatus(404)
  }
})

app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params

  await db.collection('articles').updateOne(
    { name },
    {
      $inc: { upvotes: 1 },
    }
  )
  const article = await db.collection('articles').findOne({ name })

  if (article) {
    res.json(article)
  } else {
    res.send("That article doesn't exist")
  }
})

app.post('/api/articles/:name/comments', async (req, res) => {
  const { name } = req.params
  const { postedBy, text } = req.body

  await db.collection('articles').updateOne(
    { name },
    {
      $push: { comments: { postedBy, text } },
    }
  )
  const article = await db.collection('articles').findOne({ name })

  if (article) {
    res.send(article.comments)
  } else {
    res.send("That article doesn't exist")
  }
})

connectToDb(() => {
  // Server starts up when the db connection is successful
  console.log('Successfully connected to database!')

  app.listen(8000, () => {
    console.log('Server is listening on port 8000')
  })
})
