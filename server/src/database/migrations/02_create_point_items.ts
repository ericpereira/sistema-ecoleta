//é necessário exportar as duas funções, up e down

import Knex from 'knex' //importando o tipo do knex (primeira maiuscula)

export async function up(knex: Knex){
    //criar a tabela

    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary()

        //chave estrangeira (foreign)
        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('points')

        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('points')
    })
}

export async function down(knex: Knex){
    //deletar a tabela
    return knex.schema.dropTable('point_items')
}