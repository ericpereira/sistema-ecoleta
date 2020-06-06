//é necessário exportar as duas funções, up e down

import Knex from 'knex' //importando o tipo do knex (primeira maiuscula)

export async function up(knex: Knex){
    //criar a tabela

    return knex.schema.createTable('items', table => {
        table.increments('id').primary()
        table.string('image').notNullable()
        table.string('title').notNullable()
    })
}

export async function down(knex: Knex){
    //deletar a tabela
    return knex.schema.dropTable('items')
}