import 'jest'

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

it('should create a new video when payload is fine', async done => {
  const obj = {
    video_id: 1234,
    name: 'salchicha',
    date_created: '2020-05-09T19:00:31.362Z',
    type: 'video/mp4',
    size: 3420480
  }
  const res = await request.post('/videos').send(obj)
  expect(res.statusCode).toEqual(201)
  var resp = res.body
  expect(resp).toMatchObject(obj)
  done()
})

it('should not create a new video when payload is wrong', async done => {
  const obj = {
    name: 'salchicha',
    date_created: '2020-05-09T19:00:31.362Z',
    type: 'video/mp4',
    size: 3420480
  }
  const res = await request.post('/videos').send(obj)
  expect(res.statusCode).toEqual(400)
  expect(res.body).toMatchObject({ error: 'Payload is malformed' })
  done()
})

it('should not create a new video when video_id is duplicated', async done => {
  const obj = {
    video_id: 120,
    name: 'salchicha',
    date_created: '2020-05-09T19:00:31.362Z',
    type: 'video/mp4',
    size: 3420480
  }
  const res = await request.post('/videos').send(obj)
  expect(res.statusCode).toEqual(409)
  expect(res.body).toMatchObject({ error: 'Duplicated' })
  done()
})

it('should get all videos when gets /videos', async done => {
  const expected = [
    {
      id: 1,
      video_id: 120,
      name: 'salchicha',
      date_created: '2020-05-09T19:00:31.362Z',
      type: 'video/mp4',
      size: 3420480,
      url: 'http://algo.com',
      thumb: 'http://algo.com'
    },
    {
      id: 2,
      video_id: 112,
      name: 'doberman',
      date_created: '2020-05-09T19:00:31.362Z',
      type: 'video/mp4',
      size: 3420480,
      url: 'http://algo2.com',
      thumb: 'http://algo3.com'
    },
    {
      id: 3,
      video_id: 125,
      name: 'ovejero',
      date_created: '2020-05-09T19:00:31.362Z',
      type: 'video/mp4',
      size: 3420480,
      url: 'http://algo23.com',
      thumb: 'http://alg3o.com'
    }
  ]
  const res = await request.get('/videos')

  expect(res.statusCode).toEqual(200)
  expect(res.body).toStrictEqual({ videos: expected })
  done()
})

it('should get specific video when gets /videos?id', async done => {
  const expected = [
    {
      video_id: 120,
      name: 'salchicha',
      date_created: '2020-05-09T19:00:31.362Z',
      type: 'video/mp4',
      size: 3420480,
      url: 'http://algo.com',
      thumb: 'http://algo.com'
    }
  ]
  const res = await request.get('/videos?id=120')
  expect(res.statusCode).toEqual(200)
  expect(res.body).toMatchObject({ videos: expected })
  done()
})

afterAll(async function (done) {
  await knex.destroy()
  app.close(done)
})
