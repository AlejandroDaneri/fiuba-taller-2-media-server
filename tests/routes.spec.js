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
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
)

afterEach(() => knex.migrate.rollback())

it('should create a new video when payload is fine', async done => {
  const obj = {
    video_id: 2000,
    name: 'salchicha',
    date_created: '2020-05-09T19:00:31.362Z',
    type: 'video/mp4',
    size: 3420480
  }
  const res = await request.post('/videos').send(obj)
  expect(res.statusCode).toEqual(201)
  var resp = res.body
  expect(resp.url).toBeDefined()
  expect(resp.thumb).toBeDefined()
  expect(res.body).toMatchObject(resp)
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
  expect(res.body).toHaveProperty('error', 'Payload is malformed')
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
  expect(res.body).toStrictEqual(expected)
  done()
})

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
