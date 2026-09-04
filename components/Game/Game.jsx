import { useState, useEffect } from 'react'; 
import GameConfig from './GameConfig.jsx';
import Board from '../Board/Board.jsx';
import { calculateWinner, getAIMove } from '../Game/gameRules.js'; 

import styles from './GameConfig.module.css'; 

export default function Game() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState(null);
  const [squares, setSquares] = useState([]);
  const [xIsNext, setXIsNext] = useState(true);

  // --- ESTADOS DE CONTROLE DA SÉRIE ---
  const [scores, setScores] = useState({ player1: 0, player2: 0, ties: 0 });
  const [currentGameCount, setCurrentGameCount] = useState(1);
  const [seriesOver, setSeriesOver] = useState(false);

  function handleStartGame(configData) {
    setGameConfig(configData);
    const totalCells = configData.boardSize * configData.boardSize;
    setSquares(Array(totalCells).fill(null));
    setXIsNext(true);
    setGameStarted(true);
    
    setScores({ player1: 0, player2: 0, ties: 0 });
    setCurrentGameCount(1);
    setSeriesOver(false);
  }

  // 3. Chamada do juiz a cada renderização (calcula o emoji vencedor dinamicamente)
  const winner = gameConfig ? calculateWinner(squares, gameConfig.boardSize) : null;
  const isDraw = !winner && squares.length > 0 && squares.every(square => square !== null);

  // --- EFEITO AUTOMÁTICO: TURNO DA IA ---
  useEffect(() => {
    const isAITurn = gameStarted && gameConfig?.gameMode === 'ai' && !xIsNext;
    const isGameOver = winner || isDraw;

    if (isAITurn && !isGameOver) {
      const timer = setTimeout(() => {
        // Passamos o símbolo da IA (player2Symbol) e do Jogador (player1Symbol) para as regras
        const aiMove = getAIMove(squares, gameConfig.boardSize, gameConfig.difficulty, gameConfig.player2Symbol, gameConfig.player1Symbol);
        
        if (aiMove !== null) {
          handlePlay(aiMove); 
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [squares, xIsNext, gameConfig, gameStarted, winner, isDraw]);

  // --- FUNÇÃO: ADICIONA OS PONTOS E VALIDA O ALVO DE VITÓRIAS ---
  function handleNextGame() {
    let updatedScores = { ...scores };
    
    // Agora o juiz valida com base nos emojis escolhidos e não mais em 'X' e 'O' fixos!
    if (winner === gameConfig.player1Symbol) {
      updatedScores.player1 += 1;
    } else if (winner === gameConfig.player2Symbol) {
      updatedScores.player2 += 1;
    } else if (isDraw) {
      updatedScores.ties += 1;
    }

    setScores(updatedScores);
    const targetWins = gameConfig.maxGames;

    if (updatedScores.player1 === targetWins || updatedScores.player2 === targetWins) {
      setSeriesOver(true);
    } else {
      const totalCells = gameConfig.boardSize * gameConfig.boardSize;
      setSquares(Array(totalCells).fill(null));
      setXIsNext(true);
      setCurrentGameCount(prev => prev + 1);
    }
  }

  function handlePlay(index) {
    if (winner || isDraw || squares[index]) return;

    const nextSquares = squares.slice();
    
    // Grava no tabuleiro o emoji do turno atual
    nextSquares[index] = xIsNext ? gameConfig.player1Symbol : gameConfig.player2Symbol;
    
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleBackToConfig() {
    setGameStarted(false);
  }

  if (!gameStarted) {
    return <GameConfig onStartGame={handleStartGame} />;
  }

  // --- TELA FINAL: CAMPEÃO DA SÉRIE ---
  if (seriesOver) {
    const finalWinnerName = scores.player1 === gameConfig.maxGames ? gameConfig.player1 : gameConfig.player2;

    return (
      <div className={styles.seriesOverScreen}>
        <h2>🏁 Fim da Série de Partidas!</h2>
        
        <div className={styles.championText}>
          🏆 O grande campeão da série é {finalWinnerName}!
        </div>
        
        <div className={styles.finalScorePanel}>
          <p style={{ justifyContent: 'center', fontWeight: 'bold', color: '#b57c8a', marginBottom: '1rem' }}>
            Placar Final:
          </p>
          <p>
            <span>{gameConfig.player1} ({gameConfig.player1Symbol}):</span> 
            <strong>{scores.player1} {scores.player1 === 1 ? 'vitória' : 'vitórias'}</strong>
          </p>
          <p>
            <span>{gameConfig.player2} ({gameConfig.player2Symbol}):</span> 
            <strong>{scores.player2} {scores.player2 === 1 ? 'vitória' : 'vitórias'}</strong>
          </p>
          <p>
            <span>Empates:</span> 
            <strong>{scores.ties}</strong>
          </p>
          <p className={styles.totalMatchesRow}>
            <span>Total de partidas disputadas:</span> 
            <span>{currentGameCount}</span>
          </p>
        </div>

        <button onClick={handleBackToConfig} className={styles.submitBtn}>
          Configurar Novo Jogo ⚙️
        </button>
      </div>
    );
  }

  // 4. Montagem dinâmica do status da rodada usando os emojis customizados
  let statusText;
  if (winner) {
    const winnerName = winner === gameConfig.player1Symbol ? gameConfig.player1 : gameConfig.player2;
    statusText = `🎉 Vencedor da Rodada: ${winnerName} (${winner})!`;
  } else if (isDraw) {
    statusText = "👵 Deu Velha! Empate na rodada!";
  } else {
    const currentPlayerName = xIsNext ? gameConfig.player1 : gameConfig.player2;
    const currentSymbol = xIsNext ? gameConfig.player1Symbol : gameConfig.player2Symbol;
    statusText = `Turno de: ${currentPlayerName} (${currentSymbol})`;
  }

  const willNextGameEndSeries = (winner === gameConfig.player1Symbol && scores.player1 + 1 === gameConfig.maxGames) || 
                                (winner === gameConfig.player2Symbol && scores.player2 + 1 === gameConfig.maxGames);

  return (
    <div className="game-wrapper">
      <div className={styles.scoreHeader}>
        <div className={styles.seriesProgress}>
          Partida Atual: <strong>#{currentGameCount}</strong> — Alvo da Série: <strong>{gameConfig.maxGames} Vitórias</strong>
        </div>
        <div className={styles.scoreBoard}>
          <span>{gameConfig.player1} ({gameConfig.player1Symbol}): {scores.player1}</span>
          <span className={styles.scoreDivider}>|</span>
          <span>Velhas: {scores.ties}</span>
          <span className={styles.scoreDivider}>|</span>
          <span>{gameConfig.player2} ({gameConfig.player2Symbol}): {scores.player2}</span>
        </div>
      </div>

      <Board 
        boardSize={gameConfig.boardSize} 
        squares={squares} 
        onPlay={handlePlay}
        status={statusText} 
      />

      <div className={styles.bottomArea}>
        {(winner || isDraw) ? (
          <button 
            onClick={handleNextGame} 
            className={`${styles.flowBtn} ${willNextGameEndSeries ? styles.flowBtnFinal : ''}`}
          >
            {willNextGameEndSeries ? "Finalizar Série e Ver Campeão 🏁" : "Avançar para Próxima Partida ➡️"}
          </button>
        ) : (
          <p className={styles.statusWaiting}>A partida está em andamento...</p>
        )}
      </div>
    </div>
  );
}
