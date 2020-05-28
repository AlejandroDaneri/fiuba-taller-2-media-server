exports.seed = function (knex, Promise) {
  return knex('videos')
    .del() // Deletes ALL existing entries
    .then(function () {
      return knex('videos').insert({
        video_id: '120',
        name: 'salchicha',
        date_created: '2020-05-09T19:00:31.362Z',
        type: 'video/mp4',
        size: 3420480,
        url: 'http://algo.com',
        thumb: 'http://algo.com'
      })
    })
    .then(function () {
      return knex('videos').insert({
        video_id: '112',
        name: 'doberman',
        date_created: '2020-05-09T19:00:31.362Z',
        type: 'video/mp4',
        size: 3420480,
        url: 'http://algo2.com',
        thumb: 'http://algo3.com'
      })
    })
    .then(function () {
      return knex('videos').insert({
        video_id: '125',
        name: 'ovejero',
        date_created: '2020-05-09T19:00:31.362Z',
        type: 'video/mp4',
        size: 3420480,
        url: 'http://algo23.com',
        thumb: 'http://alg3o.com'
      })
    })
}
