import 'jest'

// eslint-disable-next-line no-unused-vars
import utils from '../src/__mocks__/utils.mock'

process.env.NODE_ENV = 'test'

const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)
const knex = require('../db/knex')
const constants = require('../src/constants/constants')
const httpStatus = require('http-status-codes')

beforeEach(() =>
  knex.migrate
    .forceFreeMigrationsLock()
    .then(() => knex.migrate.rollback())
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
)

it('should returns database online', () => {
  request.get(constants.PREFIX_URL + '/status').then(res => {
    expect(res.statusCode).toEqual(httpStatus.OK)
    expect(res.body).toMatchObject({
      code: 0,
      message: 'media-server',
      data: {
        server_status: 'online',
        database_status: 'online'
      }
    })
  })
})

it('should returns database offline', () => {
  request.get(constants.PREFIX_URL + '/status').then(res => {
    expect(res.statusCode).toEqual(httpStatus.OK)
    expect(res.body).toMatchObject({
      code: 0,
      message: 'media-server',
      data: {
        server_status: 'online',
        database_status: 'offline'
      }
    })
  })
})

it('should gets the root endpoint successfully', () => {
  request.get(constants.PREFIX_URL + '/').then(res => {
    expect(res.status).toBe(httpStatus.OK)
    expect(res.text).toBe('Hello World!')
  })
})

it('should gets the ping endpoint successfully', () => {
  request.get(constants.PREFIX_URL + '/ping').then(res => {
    expect(res.status).toBe(httpStatus.OK)
    expect(res.text).toBe('Ping received!')
  })
})

afterAll(async function (done) {
  await knex.destroy()
  app.close(done)
})
