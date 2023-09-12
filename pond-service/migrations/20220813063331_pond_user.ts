import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('pond_user', (table) => {
    table.increments();
    table.string('email').unique().notNullable();
    table.string('google_id').unique().notNullable();
    table.string('username').unique().notNullable();
    table.integer('exp').notNullable().defaultTo(0);
    table.string('location').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('pond_user');
}
