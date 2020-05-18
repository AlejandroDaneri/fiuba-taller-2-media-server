import 'jest'

const utils = require('../src/utils')

it('connection to database must be successful', async done => {
  expect(await utils.checkPostgres())
  done()
})
