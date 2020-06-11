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

it('should get specific avatar when gets /pictures/user_id', done => {
  const expected = {
    name: 'pic1.jpg',
    user_id: '32a1sd5asd654',
    url: 'http://algo2.com'
  }
  request.get(constants.PREFIX_URL + '/pictures/32a1sd5asd654').then(res => {
    expect(res.statusCode).toEqual(httpStatus.OK)
    expect(res.body).toMatchObject(expected)
    done()
  })
})

it('should return not found when gets /pcitures/id when user not exists', done => {
  request.get(constants.PREFIX_URL + '/pictures/notFound').then(res => {
    expect(res.statusCode).toEqual(httpStatus.NOT_FOUND)
    expect(res.body).toMatchObject(
      errors.response(-1, 'Picture of notFound not found')
    )
    done()
  })
})

it('should delete picture when ID exists', done => {
  // TODO: revisar done
  const obj = {
    name: 'example.png',
    user_id: 'toDelete123'
  }
  request
    .post(constants.PREFIX_URL + '/pictures')
    .send(obj)
    .then(() => {
      request
        .delete(constants.PREFIX_URL + `/pictures/${obj.user_id}`)
        .then(res => {
          expect(res.statusCode).toEqual(httpStatus.OK)
          expect(res.body).toStrictEqual(
            `Successfully deleted picture of ${obj.user_id}`
          )
          done()
        })
    })
})

it('should not delete any picture when ID not exists', done => {
  // TODO: revisar done
  request.delete(constants.PREFIX_URL + '/pictures/32154').then(res => {
    expect(res.statusCode).toEqual(httpStatus.NOT_FOUND)
    expect(res.body).toMatchObject(
      errors.response(-1, 'Picture of ' + 32154 + ' not found')
    )
    done()
  })
})

it('should update avatar when PATCH /pictures ', done => {
  const obj = {
    name: 'example.png',
    user_id: 'toUpdate'
  }
  request
    .post(constants.PREFIX_URL + '/pictures')
    .send(obj)
    .then(() => {
      obj.name = 'updated.png'
      request
        .patch(constants.PREFIX_URL + `/pictures/${obj.user_id}`)
        .send(obj)
        .then(res => {
          expect(res.statusCode).toEqual(httpStatus.OK)
          expect(res.body).toMatchObject(obj)
          done()
        })
    })
})

afterAll(async function (done) {
  await knex.destroy()
  app.close(done)
})
