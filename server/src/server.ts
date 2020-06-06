import express from 'express'
import routes from './routes'
import path from 'path'
import cors from 'cors'
import { errors } from 'celebrate'

const app = express()

//configura o servidor para utilizar o cors
app.use(cors()) //depois configurar o link do site

app.use(express.json()) //precisa informar para a api entender json no body

app.use(routes) //para utilizar as rotas do arquivo separado

//servir os arquivos de forma estática
//essa função cria as rotas para todos os arquivos na pasta de forma estática
// o segundo parametro do resolve é para voltar uma pasta igual o ../
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

//lida com a forma com que retorna os erros pro front
app.use(errors())

app.listen(3333)