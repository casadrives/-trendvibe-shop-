const { MongoClient } = require('mongodb')

let cachedDb = null

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = client.db('trendy_shop')
  cachedDb = db
  return db
}

module.exports = { connectToDatabase }
