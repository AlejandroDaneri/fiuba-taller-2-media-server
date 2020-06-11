import 'jest'
// TODO: revisar que no se llama al mock de firebase aunque lo importe
process.env.NODE_ENV = 'test'

const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)
const knex = require('../db/knex')
const constants = require('../src/constants/constants')
const httpStatus = require('http-status-codes')
// const errors = require('../src/errors/errors')

beforeEach(() =>
  knex.migrate
    .forceFreeMigrationsLock()
    .then(() => knex.migrate.rollback())
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
)

it('should create a new video when payload is fine', done => {
  const obj = {
    name: 'pic1.jpg',
    user_id: '32a1sd5asd654'
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

afterAll(async function (done) {
  await knex.destroy()
  app.close(done)
})
