import { MongoClient } from 'mongodb'

let db

async function connectToDb(cb) {
  const client = new MongoClient('mongodb://127.0.0.1:27017') // 27017: Default port for MongoDB

  await client.connect()

  db = client.db('react-blog-db') // same as 'use react-blog-db'
  
  cb()
}

export { db, connectToDb }
