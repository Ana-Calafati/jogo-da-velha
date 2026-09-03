import { useState } from 'react';
import GameConfig from './GameConfig.jsx';
import Board from '../Board/Board.jsx';
import { calculateWinner } from '../Game/gameRules.js'; // 1. Importa a regra do juiz

export default function Game() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState(null);
  const [squares, setSquares] = useState([]);
  const [xIsNext, setXIsNext] = useState(true);

  function handleStartGame(configData) {
    setGameConfig(configData);
    const totalCells = configData.boardSize * configData.boardSize;
    setSquares(Array(totalCells).fill(null));
    setXIsNext(true);
    setGameStarted(true);
  }

  // 2. Executa a chamada do juiz diretamente a cada renderização
  const winner = gameConfig ? calculateWinner(squares, gameConfig.boardSize) : null;
  
  // Verifica se todas as casas estão preenchidas (Empate/Deu Velha)
  const isDraw = !winner && squares.length > 0 && squares.every(square => square !== null);

  function handlePlay(index) {
    // 3. BLOQUEIO: Se já tiver um vencedor ou a casa estiver ocupada, ignora o clique!
    if (winner || squares[index]) return;

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? 'X' : 'O';
    
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleResetMatch() {
    const totalCells = gameConfig.boardSize * gameConfig.boardSize;
    setSquares(Array(totalCells).fill(null));
    setXIsNext(true);
  }

  if (!gameStarted) {
    return <GameConfig onStartGame={handleStartGame} />;
  }

  // 4. Montagem dinâmica da mensagem de status baseado no resultado
  let statusText;
  if (winner) {
    const winnerName = winner === 'X' ? gameConfig.player1 : gameConfig.player2;
    statusText = `🎉 Vencedor: ${winnerName} (${winner})!`;
  } else if (isDraw) {
    statusText = "👵 Deu Velha! Empate!";
  } else {
    const currentPlayerName = xIsNext ? gameConfig.player1 : gameConfig.player2;
    const currentSymbol = xIsNext ? 'X' : 'O';
    statusText = `Turno de: ${currentPlayerName} (${currentSymbol})`;
  }

  return (
    <div className="game-wrapper">
      <Board 
        boardSize={gameConfig.boardSize} 
        squares={squares} 
        onPlay={handlePlay}
        status={statusText} // Envia o texto atualizado (Turno, Vitória ou Empate)
      />

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={handleResetMatch} 
          style={{
            marginTop: '1rem',
            backgroundColor: '#ffb6c1',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Reiniciar Partida 🔄
        </button>
      </div>
    </div>
  );
}
