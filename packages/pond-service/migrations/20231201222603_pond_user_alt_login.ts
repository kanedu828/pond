import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("pond_user", (table) => {
    table.string("cookie").unique();
    table.string("password_hash");
    table.string("google_id").nullable().alter();
    table.string("email").nullable().alter();
    table.boolean("is_account").notNullable().defaultTo(true);
  });

  await knex.schema.table("pond_user", (table) => {
    table.boolean("is_account").notNullable().defaultTo(false).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("pond_user", (table) => {
    table.dropColumn("cookie");
    table.dropColumn("password_hash");
    table.string("google_id").notNullable().alter();
    table.string("email").notNullable().alter();
    table.dropColumn("is_account");
  });
}
