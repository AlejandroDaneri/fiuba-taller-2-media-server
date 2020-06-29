exports.up = function (knex) {
  return knex.schema.createTable('videos', function (table) {
    table
      .string('video_id', 500)
      .notNullable()
      .primary()
    table.string('name').notNullable()
    table.string('user_id').notNullable()
    table.string('date_created').notNullable()
    table.string('type').notNullable()
    table.integer('size').notNullable()
    table.string('url', 1000).notNullable()
    table.string('thumb', 1000).notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('videos')
}
