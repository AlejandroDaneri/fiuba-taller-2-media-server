import 'jest'

var Firebase = require('../src/firebase')
var fb = new Firebase()

it('should obtain links of url and thumb', () => {
  fb.getLinks('fileExample').then(([video, thumb]) => {
    expect(video).toMatch(/(https:)/i)
    expect(thumb).toMatch(/(https:)/i)
  })
})

it('should obtain same firebase instance when created new one', () => {
  const fb2 = new Firebase()
  expect(fb2 === fb)
})
