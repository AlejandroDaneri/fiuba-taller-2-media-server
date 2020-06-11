import 'jest'
// TODO: revisar que no se llama al mock de firebase aunque lo importe
process.env.NODE_ENV = 'test'

const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)
const knex = require('../db/knex')
const constants = require('../src/constants/constants')
const httpStatus = require('http-status-codes')
const errors = require('../src/errors/errors')

beforeEach(() =>
  knex.migrate
    .forceFreeMigrationsLock()
    .then(() => knex.migrate.rollback())
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
)

it('should create a new avatar when payload is fine', done => {
  const obj = {
    name: 'pic1.jpg',
    user_id: '231asd5ww1'
  }
  request
    .post(constants.PREFIX_URL + '/pictures')
    .send(obj)
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.CREATED)
      const resp = res.body
      expect(resp).toMatchObject(obj)
      expect(resp.url).toMatch(/(https:)/i)
      done()
    })
})

it('should create a new avatar when payload is wrong', done => {
  const obj = {
    user_id: '32a1sd5asd654'
  }
  request
    .post(constants.PREFIX_URL + '/pictures')
    .send(obj)
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.BAD_REQUEST)
      expect(res.body).toMatchObject(
        errors.response(-1, 'Payload is malformed')
      )
      done()
    })
})

it('should not create a new avatar when user_id is duplicated', done => {
  const obj = {
    name: 'error.jpg',
    user_id: '32a1sd5asd654'
  }
  request
    .post(constants.PREFIX_URL + '/pictures')
    .send(obj)
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.CONFLICT)
      expect(res.body).toMatchObject(
        errors.response(-1, `Picture of ${obj.user_id} already exists`)
      )
      done()
    })
})
afterAll(async function (done) {
  await knex.destroy()
  app.close(done)
})
