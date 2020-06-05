import 'jest'

export default class Firebase {
  constructor () {
    console.debug('Mock Firebase: constructor was called')
  }

  getLinks () {
    console.debug('Mock Firebase: getLinks was called')
    return Promise.resolve([
      'https://trendy.com/url',
      'https://trendy.com/thumb'
    ]).catch()
  }

  deleteVideo () {
    console.debug('Mock Firebase: deleteVideo was called')
    return Promise.resolve(1).catch()
  }
}
