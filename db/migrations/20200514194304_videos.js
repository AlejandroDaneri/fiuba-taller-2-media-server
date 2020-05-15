exports.up = function (knex) {
  return knex.schema.createTable('videos', function (table) {
    table
      .increments('id')
      .primary()
      .unsigned()
    table
      .integer('video_id')
      .notNullable()
      .unique()
    table.string('name').notNullable()
    table.string('date_created').notNullable()
    table.string('type').notNullable()
    table.integer('size').notNullable()
    table
      .string('url')
      .notNullable()
      .unique()
    table
      .string('thumb')
      .notNullable()
      .unique()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('videos')
}
