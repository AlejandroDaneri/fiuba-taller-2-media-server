import 'jest'

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

it('request must be accepted when passing api_key', done => {
  const expected = {
    name: 'pic1.jpg',
    user_id: '32a1sd5asd654',
    url: 'http://algo2.com'
  }
  request
    .get('/api/v1/pictures/32a1sd5asd654')
    .set({
      'X-Client-ID': process.env.API_KEY,
      'Content-Type': 'application/json'
    })
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.OK)
      expect(res.body).toMatchObject(expected)
      done()
    })
})

it('request must fail when passing wrong api_key', done => {
  request
    .get('/api/v1/pictures/32a1sd5asd654')
    .set({ 'X-Client-ID': 'cualquiera', 'Content-Type': 'application/json' })
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.UNAUTHORIZED)
      done()
    })
})

it('request must fail when not passing api_key', done => {
  request
    .get('/api/v1/pictures/32a1sd5asd654')
    .set({ 'Content-Type': 'application/json' })
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.UNAUTHORIZED)
      done()
    })
})

afterAll(async function (done) {
  await knex.destroy()
  app.close(done)
})
