exports.seed = function (knex, Promise) {
  return knex('pictures')
    .del() // Deletes ALL existing entries
    .then(function () {
      return knex('pictures').insert({
        name: 'pic1.jpg',
        user_id: '32a1sd5asd654',
        url: 'http://algo2.com'
      })
    })
}
