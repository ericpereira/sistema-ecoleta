import knex from 'knex'

//para lidar com caminhos dentro do node
import path from 'path'

const connection = knex({
    client: 'sqlite3',
    connection: {
        //__dirname: variavel global que aponta pro diretorio atual, database.sqlite é o
        //nome do arquivo do banco de dados
        filename: path.resolve(__dirname, 'database.sqlite') 
    },
    useNullAsDefault: true
})

export default connection