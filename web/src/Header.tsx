import React from 'react'

interface HeaderProps{
    title: string //caso fosse opcional, deveria ser title?:string
}

//:React.FC quer dizer que é um componente escrito em formato de função
//Generic, tipo no typescript que pode receber um parâmetro
const Header: React.FC<HeaderProps> = (props) => {
    return (
        <header>
            <h1>Ecoleta {props.title}</h1>
        </header>
    )
}

export default Header