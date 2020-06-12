import 'jest'

var checkPostgres = jest
  .fn()
  .mockImplementationOnce(() => Promise.resolve())
  .mockImplementationOnce(() => Promise.reject(new Error()))

const utils = jest.mock('../utils/pgUtils', () => {
  return {
    checkPostgres: checkPostgres
  }
})

export default utils
