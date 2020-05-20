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

it('should returns database online', async done => {
  var res = await request.get('/status')

  expect(res.statusCode).toEqual(200)
  expect(res.body).toMatchObject({
    code: 0,
    message: 'media-server',
    'data:': {
      server_status: 'online',
      database_status: 'online'
    }
  })
  done()
})

it('should returns database offline', async done => {
  var res = await request.get('/status')

  expect(res.statusCode).toEqual(200)
  expect(res.body).toMatchObject({
    code: 0,
    message: 'media-server',
    'data:': {
      server_status: 'online',
      database_status: 'offline'
    }
  })
  done()
})

it('should gets the root endpoint successfully', async done => {
  const response = await request.get('/')

  expect(response.status).toBe(200)
  expect(response.text).toBe('Hello World!')
  done()
})

it('should gets the ping endpoint successfully', async done => {
  const response = await request.get('/ping')

  expect(response.status).toBe(200)
  expect(response.text).toBe('Ping received!')
  done()
})

afterAll(async function (done) {
  await knex.destroy()
  app.close(done)
})
