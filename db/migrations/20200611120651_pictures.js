exports.up = function (knex) {
  return knex.schema.createTable('pictures', function (table) {
    table
      .increments('id')
      .primary()
      .unsigned()
    table
      .string('user_id', 500)
      .notNullable()
      .unique()
    table.string('url', 1000).notNullable()
    table.string('name').notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('pictures')
}
