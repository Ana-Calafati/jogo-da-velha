import { useState } from 'react';
import GameConfig from './GameConfig.jsx';


export default function Game() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState(null);

  function handleStartGame(configData) {
    setGameConfig(configData);
    setGameStarted(true);
  }

  // Garanta que esta condição está correta e retornando o componente!
  if (!gameStarted) {
    return <GameConfig onStartGame={handleStartGame} />;
  }

  return (
    <div>
      <h2>Jogo Iniciado!</h2>
      <p>Jogador 1: {gameConfig?.player1}</p>
      <p>Jogador 2: {gameConfig?.player2}</p>
    </div>
  );
}
