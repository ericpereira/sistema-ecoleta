import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'

import './style.css'

interface Props {
  //função quere recebe um arquivo e retorna void
  onFileUploaded: (file: File) => void
}

//fala que o dropzone é um Function Component e recebe props
const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  

  //criar preview da imagem enviada
  const [selectedFileUrl, setSelectedFileUrl] = useState('')

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0] //como só tem um arquivo, vai estar na posição zero

    const fileUrl = URL.createObjectURL(file)

    setSelectedFileUrl(fileUrl) //seta no estado a url

    onFileUploaded(file) //chama a função (que recebeu do pai) depois que receber o arquivo

  }, [onFileUploaded])
  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: 'image/*'})

  return (
    <div className='dropzone' {...getRootProps()}>
      <input {...getInputProps()} accept='image/*' />
      {
        selectedFileUrl

        ? <img src={selectedFileUrl} />
        
        : <p>
        <FiUpload />
        Imagem Estabelecimento</p>
      }
      
    </div>
  )
}

export default Dropzone