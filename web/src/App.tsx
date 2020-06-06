import React from 'react';
import './App.css';

import Routes from './routes'

function App() {
  // //pega de dentro do use state o estado e uma função para atualizar esse estado
  // const [contador, setCounter] = useState(0) //[valor do estado, função para atualizar o valor do estado]

  // function handleButtonClick(){
  //   setCounter(contador + 1)
  // }

  return (
    <Routes />
  );
}

export default App;
