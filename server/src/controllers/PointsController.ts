import { Request, Response } from 'express' //importando os tipos de request e response
import knex from '../database/connection' //importando conexão com o banco de dados

class PointsController {
    async index (request: Request, response: Response){
        //cidade, uf, items (Query Params)
        const { city, uf, items } = request.query

        //String(items) - transforma em string
        //.split(',') - separa a string em array consultando o separador ,
        //.map() - para percorrer os itens do array
        //.trim() - retirar os espaços em branco
        //Number(item.trim()) - transformar o valor retornado em número
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()))

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id') //tabela que precisa fazer o join, id da tabela consultado, id da tabela que precisa fazer o join
            .whereIn('point_items.item_id', parsedItems) //caso tenha algum dos ids passados em parsedItems
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct() //retorna pontos distintos
            .select('points.*') //dados da tabela points e não da tabela que foi feito o join

        //serializa os pontos
        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.1.9:3333/uploads/${point.image}`
            }
        })

        console.log(city, uf, items)
        return response.json(serializedPoints)
    }

    async show (request: Request, response: Response){ //exibe um ponto de coleta
        const { id } = request.params //const id = request.paramds.id

        //busca o ponto com o id informado
        const point = await knex('points').where('id', id).first()

        if(!point){ //caso dê errado
            return response.status(400).json({ messagem: 'Point not found' })
        }

        //serializa os pontos
        const serializedPoint =  {
            ...point,
            image_url: `http://192.168.1.9:3333/uploads/${point.image}`
        }

        //busca os itens que o ponto coleta

        /*
            SELECT * FROM items
            JOIN point_items ON items.id = point_items.item_id
            WHERE point_items.point_id
        */
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title')

        return response.json({ serializedPoint, items })
    }

    async create (request: Request, response: Response){
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body
    
        //trx, transação, vai esperar as querys serem executadas para confirmar
        const trx = await knex.transaction()
    
        //inserir no bando de dados
        const point = {
            image: request.file.filename, //pega o nome do arquivo passado na requisição
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        //retorna um array com os itens inseridos, como só inseriu 1, o primeiro elemento é o id
        const insertedIds = await trx('points').insert(point)
    
        const point_id = insertedIds[0] //pega o id do ultimo ponto adicionado
    
        const pointItems = items
            .split(',') //pega o vetor passado com virgula e transforma em array
            .map((item: string) => Number(item.trim())) //percorre todos os itens tirando o espaço
            .map((item_id: number) => { //diz que o item_id é do tipo number
                return {
                    item_id,
                    point_id 
                }
            })
    
        await trx('point_items').insert(pointItems)
        
        await trx.commit() //depois de executar tudo, commita

        return response.json({
            id: point_id,
            ...point
        })
    }
}

export default PointsController