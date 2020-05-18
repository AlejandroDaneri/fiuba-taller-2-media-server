require('dotenv').config()

module.exports = {
  async checkPostgres () {
    const { Client } = require('pg')
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })
    await client.connect()
    await client.end()
  }
}
