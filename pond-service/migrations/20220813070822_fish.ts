import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fish', (table) => {
    table.increments();
    table.integer('max_length').notNullable();
    table.integer('fish_id').notNullable().index();
    table.integer('count').notNullable().defaultTo(0);
    table
      .integer('pond_user_id')
      .notNullable()
      .references('id')
      .inTable('pond_user')
      .onDelete('CASCADE')
      .index();
    table.timestamps(true, true);
    table.unique(['pond_user_id', 'fish_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('fish');
}
