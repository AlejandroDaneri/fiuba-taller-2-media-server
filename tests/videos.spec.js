import 'jest'

process.env.NODE_ENV = 'test'

const Firebase = require('../src/services/firebase')
jest.spyOn(Firebase.prototype, 'getVideoLinks').mockImplementation(() => {
  return ['https://mock.com', 'https://mock.com']
})
jest.spyOn(Firebase.prototype, 'deleteVideo').mockImplementation(() => {
  return 'mock'
})

const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)
const knex = require('../db/knex')
const constants = require('../src/constants/constants')
const httpStatus = require('http-status-codes')
const errors = require('../src/errors/errors')

const VIDEOS_URL = constants.PREFIX_URL + '/videos/'
const header = {
  'X-Client-ID': process.env.API_KEY,
  'Content-Type': 'application/json'
}

beforeEach(() =>
  knex.migrate
    .forceFreeMigrationsLock()
    .then(() => knex.migrate.rollback())
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
)

it('should create a new video when payload is fine', done => {
  const obj = {
    video_id: '1234',
    name: 'salchicha',
    date_created: '2020-05-09T19:00:31.362Z',
    type: 'video/mp4',
    size: 3420480,
    user_id: '32a1sd5asd654'
  }
  request
    .post(VIDEOS_URL)
    .set(header)
    .send(obj)
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.CREATED)
      var resp = res.body
      expect(resp).toMatchObject(obj)
      expect(resp.url).toMatch(/(https:)/i)
      done()
    })
})

it('should create a new video when payload is fine but with more fields', done => {
  const obj = {
    video_id: '1234',
    name: 'salchicha',
    date_created: '2020-05-09T19:00:31.362Z',
    type: 'video/mp4',
    size: 3420480,
    user_id: '32a1sd5asd654'
  }
  obj.unknown = 'trash'
  request
    .post(VIDEOS_URL)
    .set(header)
    .send(obj)
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.CREATED)
      var resp = res.body
      expect(resp).toMatchObject(obj)
      expect(resp.url).toMatch(/(https:)/i)
      done()
    })
})

it('should not create a new video when payload is wrong', done => {
  const obj = {
    name: 'salchicha',
    date_created: '2020-05-09T19:00:31.362Z',
    type: 'video/mp4',
    size: 3420480
  }
  request
    .post(VIDEOS_URL)
    .set(header)
    .send(obj)
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.BAD_REQUEST)
      expect(res.body).toMatchObject(
        errors.response(-1, 'Payload is malformed')
      )
      done()
    })
})

it('should not create a new video when video_id is duplicated', done => {
  const obj = {
    video_id: '120',
    name: 'salchicha',
    date_created: '2020-05-09T19:00:31.362Z',
    type: 'video/mp4',
    size: 3420480,
    user_id: '32a1sd5asd654'
  }
  request
    .post(VIDEOS_URL)
    .set(header)
    .send(obj)
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.CONFLICT)
      expect(res.body).toMatchObject(
        errors.response(-1, `Video ${obj.video_id} already exists`)
      )
      done()
    })
})

it('should get all videos when gets /videos', done => {
  const expected = [
    {
      video_id: '120',
      name: 'salchicha',
      date_created: '2020-05-09T19:00:31.362Z',
      type: 'video/mp4',
      size: 3420480,
      url: 'http://algo.com',
      thumb: 'http://algo.com',
      user_id: '32a1sd5asd654'
    },
    {
      video_id: '112',
      name: 'doberman',
      date_created: '2020-05-09T19:00:31.362Z',
      type: 'video/mp4',
      size: 3420480,
      url: 'http://algo2.com',
      thumb: 'http://algo3.com',
      user_id: '32a1sd5asd654'
    },
    {
      video_id: '125',
      name: 'ovejero',
      date_created: '2020-05-09T19:00:31.362Z',
      type: 'video/mp4',
      size: 3420480,
      url: 'http://algo23.com',
      thumb: 'http://alg3o.com',
      user_id: '32a1sd5asd654'
    }
  ]
  request
    .get(VIDEOS_URL)
    .set(header)
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.OK)
      expect(res.body).toStrictEqual({ videos: expected })
      done()
    })
})

it('should get specific video when gets /videos/id', done => {
  const expected = {
    video_id: '120',
    name: 'salchicha',
    date_created: '2020-05-09T19:00:31.362Z',
    type: 'video/mp4',
    size: 3420480,
    url: 'http://algo.com',
    thumb: 'http://algo.com',
    user_id: '32a1sd5asd654'
  }
  request
    .get(VIDEOS_URL + '120')
    .set(header)
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.OK)
      expect(res.body).toMatchObject(expected)
      done()
    })
})

it('should get specific video when gets /videos/id', done => {
  request
    .delete(VIDEOS_URL + '120')
    .set(header)
    .then(() => {
      request
        .get(VIDEOS_URL + '120')
        .set(header)
        .then(res => {
          expect(res.statusCode).toEqual(httpStatus.NOT_FOUND)
          expect(res.body).toMatchObject(
            errors.response(-1, 'Video 120 not found')
          )
          done()
        })
    })
})

it('should return not found when gets /videos/id when video not exists', done => {
  request
    .get(VIDEOS_URL + '/12320')
    .set(header)
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.NOT_FOUND)
      expect(res.body).toMatchObject(
        errors.response(-1, 'Video ' + 12320 + ' not found')
      )
      done()
    })
})

it('should get specific video when gets /videos?id', done => {
  const expected = [
    {
      video_id: '120',
      name: 'salchicha',
      date_created: '2020-05-09T19:00:31.362Z',
      type: 'video/mp4',
      size: 3420480,
      url: 'http://algo.com',
      thumb: 'http://algo.com',
      user_id: '32a1sd5asd654'
    }
  ]
  request
    .get(constants.PREFIX_URL + '/videos?id=120')
    .set(header)
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.OK)
      expect(res.body).toMatchObject({ videos: expected })
      done()
    })
})

it('should delete video when ID exists', done => {
  const obj = {
    video_id: '5000',
    name: 'salchicha',
    date_created: '2020-05-09T19:00:31.362Z',
    type: 'video/mp4',
    size: 3420480,
    user_id: '32a1sd5asd654'
  }
  request
    .post(VIDEOS_URL)
    .set(header)
    .send(obj)
    .then(() => {
      request
        .delete(VIDEOS_URL + '5000')
        .set(header)
        .then(res => {
          expect(res.statusCode).toEqual(httpStatus.OK)
          expect(res.body).toStrictEqual('Successfully deleted video 5000')
          done()
        })
    })
})

it('should not delete any video when ID not exists', done => {
  request
    .delete(VIDEOS_URL + '32154')
    .set(header)
    .then(res => {
      expect(res.statusCode).toEqual(httpStatus.NOT_FOUND)
      expect(res.body).toMatchObject(
        errors.response(-1, 'Video ' + 32154 + ' not found')
      )
      done()
    })
})

afterAll(async function (done) {
  await knex.destroy()
  app.close(done)
})
