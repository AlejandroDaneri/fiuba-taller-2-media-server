import 'jest'

import utils from '../src/__mocks__/utils.mock'

const app = require('../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

it('should create a new video when payload is fine', async done => {
  const obj = {
    id: 1,
    name: 'string',
    dateCreated: 'string',
    size: 1234
  }
  const res = await request.post('/videos').send(obj)
  expect(res.statusCode).toEqual(201)
  var resp = res.body
  expect(resp.url).toBeDefined()
  expect(resp.thumb).toBeDefined()
  expect(res.body).toMatchObject(resp)
  done()
})

// it('should not create a new video when have wrong payload', async done => {
//   const obj = {
//     name: 'string',
//     dateCreated: 'string',
//     size: 1234
//   }
//   const res = await request.post('/videos').send(obj)
//   expect(res.statusCode).toEqual(400)
//   done()
// })

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

afterAll(function (done) {
  app.close(done)
  utils.autoMockOff() // no effect, only for disable lint problems
})
