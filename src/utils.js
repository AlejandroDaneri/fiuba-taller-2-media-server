module.exports = {
  async check_postgres () {
    const { Client } = require('pg')
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })
    await client.connect()
    await client.end()
    return 'online'
  }
}