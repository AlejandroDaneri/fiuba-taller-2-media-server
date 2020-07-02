import 'jest'

// eslint-disable-next-line no-unused-vars
import utils from '../src/__mocks__/utils.mock'

process.env.NODE_ENV = 'test'

const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)
const knex = require('../db/knex')
const httpStatus = require('http-status-codes')

beforeEach(() =>
  knex.migrate
    .forceFreeMigrationsLock()
    .then(() => knex.migrate.rollback())
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
)

it('should returns database online', done => {
  request.get('/status').then(res => {
    expect(res.statusCode).toEqual(httpStatus.OK)
    expect(res.body).toMatchObject({
      code: 0,
      message: 'media-server',
      data: {
        server_status: 'online',
        database_status: 'online'
      }
    })
    done()
  })
})

it('should returns database offline', done => {
  request.get('/status').then(res => {
    expect(res.statusCode).toEqual(httpStatus.OK)
    expect(res.body).toMatchObject({
      code: 0,
      message: 'media-server',
      data: {
        server_status: 'online',
        database_status: 'offline'
      }
    })
    done()
  })
})

it('should gets the root endpoint successfully', done => {
  request.get('/').then(res => {
    expect(res.status).toBe(httpStatus.OK)
    expect(res.text).toBe('Welcome to Choutuve Media Server API (V1)!')
    done()
  })
})

it('should gets the ping endpoint successfully', done => {
  request.get('/ping').then(res => {
    expect(res.status).toBe(httpStatus.OK)
    expect(res.text).toBe('Ping received!')
    done()
  })
})

afterAll(async function (done) {
  await knex.destroy()
  app.close(done)
})
