import { Request, Response } from 'express'
import knex from '../database/connection' //importando conexão com o banco de dados

class ItemsController {

    async index(request: Request, response: Response){
        //sempre que utilizar uma query, tem que usar o await pq a query demora
        const items = await knex('items').select('*') //SELECT * FROM items
    
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.1.9:3333/uploads/${item.image}`
            }
        })
    
        return response.json(serializedItems)
    }
}

export default ItemsController