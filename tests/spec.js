const app = require('../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

it('Gets the root endpoint', async done => {
  const response = await request.get('/')

  expect(response.status).toBe(200)
  expect(response.text).toBe('Hello World!')
  done()
})

it('Gets the ping endpoint', async done => {
  const response = await request.get('/ping')

  expect(response.status).toBe(200)
  expect(response.text).toBe('Ping received!')
  done()
})

afterAll(function (done) {
  app.close(done)
})
