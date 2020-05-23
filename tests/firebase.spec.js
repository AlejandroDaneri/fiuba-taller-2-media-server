import 'jest'

var Firebase = require('../src/firebase')
var fb = new Firebase()

it('should obtain links of url and thumb', () => {
  fb.getLinks('fileExample').then(([video, thumb]) => {
    expect(video).toMatch(/(https:)/i)
    expect(thumb).toMatch(/(https:)/i)
  })
})
