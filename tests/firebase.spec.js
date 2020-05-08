const app = require('../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

it('Gets json containing a list of all videos', async done => {
  request
    .get('/list')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done)
})

afterAll(function (done) {
  app.close(done)
})
