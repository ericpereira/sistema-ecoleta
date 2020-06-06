import multer from 'multer'
import path from 'path'

//parar gerar um hash aleatório
import crypto from 'crypto'

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename(request, file, callback){

            //gera uma string hexadecimal com tamanho de 6 bytes
            const hash = crypto.randomBytes(6).toString('hex')

            const fileName = `${hash}-${file.originalname}`

            callback(null, fileName)
        }
    })
}