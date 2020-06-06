import path from 'path'

module.exports = {
    client: 'sqlite3',
    connection: {
        //__dirname: variavel global que aponta pro diretorio atual, database.sqlite é o
        //nome do arquivo do banco de dados
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite') 
    },
    //informar pasta onde estão as migrations
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true
}