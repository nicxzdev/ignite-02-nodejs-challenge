import type { Knex } from "knex"


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) => {
        table.uuid('id').primary(),
            table.uuid('userId').references('users.id').notNullable(),
            table.string('name').notNullable(),
            table.string('description').notNullable(),
            table.boolean('onDiet').notNullable(),
            table.dateTime('date').notNullable(),
            table.timestamp('createdAt').defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals')
}

