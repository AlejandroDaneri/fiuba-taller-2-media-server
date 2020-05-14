module.exports = {
  //   async update () {
  //     const { Client } = require('pg')
  //     const client = new Client({
  //       connectionString: process.env.DATABASE_URL
  //     })
  //     await client.connect()
  //     client.query('SELECT * FROM table')
  //         .then(response => {
  //             console.log(response.rows)
  //             client.end()
  //         })
  //         .catch(err => {
  //             client.end()
  //         })
  //     await client.end()
  //   }

  async checkPostgres () {
    const { Client } = require('pg')
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })
    await client.connect()
    await client.end()
  }
}
