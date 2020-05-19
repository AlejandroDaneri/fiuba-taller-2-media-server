import 'jest'

var listVideoFiles = jest
  .fn()
  .mockImplementationOnce(() => Promise.resolve())
  .mockImplementationOnce(() => Promise.reject(new Error()))

const firebase = jest.mock('../firebase', () => {
  return {
    listVideoFiles: listVideoFiles,
    constructor: true
  }
})

export default firebase
