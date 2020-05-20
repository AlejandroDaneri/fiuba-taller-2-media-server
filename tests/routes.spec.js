import 'jest'

// eslint-disable-next-line no-unused-vars
import utils from '../src/__mocks__/utils.mock'

process.env.NODE_ENV = 'test'

const app = require('../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)
const knex = require('../db/knex')
beforeEach(() =>
  knex.migrate
    .forceFreeMigrationsLock()
    .then(() => knex.migrate.rollback())
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
)

it('should returns database online', () => {
  request.get('/status').then(res => {
    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchObject({
      code: 0,
      message: 'media-server',
      'data:': {
        server_status: 'online',
        database_status: 'online'
      }
    })
  })
})

it('should returns database offline', () => {
  request.get('/status').then(res => {
    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchObject({
      code: 0,
      message: 'media-server',
      'data:': {
        server_status: 'online',
        database_status: 'offline'
      }
    })
  })
})

it('should gets the root endpoint successfully', () => {
  request.get('/').then(res => {
    expect(res.status).toBe(200)
    expect(res.text).toBe('Hello World!')
  })
})

it('should gets the ping endpoint successfully', () => {
  request.get('/ping').then(res => {
    expect(res.status).toBe(200)
    expect(res.text).toBe('Ping received!')
  })
})

afterAll(async function (done) {
  await knex.destroy()
  app.close(done)
})
