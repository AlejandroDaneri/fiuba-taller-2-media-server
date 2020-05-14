import 'jest'

var checkPostgres = jest
  .fn()
  .mockImplementationOnce(() => Promise.resolve())
  .mockImplementationOnce(() => Promise.reject(new Error()))

const utils = jest.mock('../utils', () => {
  return {
    check_postgres: checkPostgres
  }
})

export default utils
