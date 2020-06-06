import express from 'express'
import { celebrate, Joi } from 'celebrate'

//importa o multer para lidar com o upload dos arquivos
import multer from 'multer'
import multerConfig from './config/multer' 

//importando controllers
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

//serve para desacoplar as rotas do arquivo principal do servidor
const routes = express.Router()

const upload = multer(multerConfig)

//index, show, create, update, delete
const pointsController = new PointsController()
const itemsController = new ItemsController()

//lista os items
routes.get('/items', itemsController.index)

//PONTOS DE COLETA
//se fosse várias fotos seria upload.array('fotos')
routes.post(
  '/points',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required(),
    })
  }),
  pointsController.create) //criar ponto de coleta


routes.get('/points/:id', pointsController.show) //exibe um ponto de coleta
routes.get('/points', pointsController.index) //exibe todos os pontos de coleta

//precisa exportar as rotas
export default routes