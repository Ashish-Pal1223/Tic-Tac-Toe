import { useState } from 'react';

import Player from './Components/Player.jsx';
import GameBoard from './Components/GameBoard.jsx';
import Log from './Components/Log.jsx';
import GameOver from './Components/GameOver.jsx';
import { WINNING_COMBINATIONS } from './winning-combinations.js';

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

function deriveActivePlayer(gameTurns){
  let currentPlayer = 'X';
  
  if(gameTurns.length > 0 && gameTurns[0].player === 'X'){
    currentPlayer = 'O';
  }

  return currentPlayer;
}

function App() {
  const [ players, setPlayers ] = useState({
    'X' : 'Player 1',
    'O' : 'Player 2',
  });
  const [ gameTurns, setGameTurns ] = useState([]);

  const activePlayer = deriveActivePlayer(gameTurns);

  let gameBoard = [...initialGameBoard.map(array => [...array])];

  for(const turn of gameTurns){
    const { square, player } = turn;
    const { row , col } = square;

    gameBoard[row][col] = player;
  }

  function deriveWinner(gameBoard, players){
    let winner;

    for(const combinations of WINNING_COMBINATIONS){
      const firstSquareSymbol = gameBoard[combinations[0].row][combinations[0].column];
      const secondSquareSymbol = gameBoard[combinations[1].row][combinations[1].column];
      const thirdSquareSymbol = gameBoard[combinations[2].row][combinations[2].column];

      if(
        firstSquareSymbol &&
        firstSquareSymbol === secondSquareSymbol &&
        firstSquareSymbol === thirdSquareSymbol
      ){
        winner = players[firstSquareSymbol];
      }
    }
    return winner;
  }
  
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex){
    setGameTurns((prevTurns) => {
       
      const activePlayer = deriveActivePlayer(prevTurns);

      const updateTurns = [
        { square : { row: rowIndex, col: colIndex }, player: activePlayer },
        ...prevTurns,
      ];

      return updateTurns;
    });
  }

  function handleRestart(){
    setGameTurns([]);
  }

  function handleChangePlayerName(symbol, newName){
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol] : newName
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player 
            initialName="player 1" 
            symbol="X" 
            isActive={activePlayer === "X"}
            onChangeName = {handleChangePlayerName}
          />
          <Player 
            initialName="player 2" 
            symbol="O" 
            isActive={activePlayer === "O"}
            onChangeName = {handleChangePlayerName}
          />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard onSelectSquare={handleSelectSquare} board = {gameBoard} />
      </div>
      <Log turns = {gameTurns}/>
    </main>
  )
}

export default App
