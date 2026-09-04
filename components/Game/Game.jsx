import { useState, useEffect } from 'react'; // 1. Mantém o useEffect ativo para monitorar os turnos
import GameConfig from './GameConfig.jsx';
import Board from '../Board/Board.jsx';
// 2. Atualizado o import para usar a nova função mestre de IA (getAIMove)
import { calculateWinner, getAIMove } from '../Game/gameRules.js'; 

// Importa o arquivo de estilos unificado
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
    
    // Reseta completamente a série para um novo jogo
    setScores({ player1: 0, player2: 0, ties: 0 });
    setCurrentGameCount(1);
    setSeriesOver(false);
  }

  // 3. Chamada do juiz a cada renderização
  const winner = gameConfig ? calculateWinner(squares, gameConfig.boardSize) : null;
  const isDraw = !winner && squares.length > 0 && squares.every(square => square !== null);

  // --- EFEITO AUTOMÁTICO: TURNO DA IA COM NÍVEIS DE DIFICULDADE ---
  useEffect(() => {
    // Só age se o jogo começou, o modo escolhido for 'ai', for o turno do 'O' (Robô) e a partida não acabou
    const isAITurn = gameStarted && gameConfig?.gameMode === 'ai' && !xIsNext;
    const isGameOver = winner || isDraw;

    if (isAITurn && !isGameOver) {
      // Pequeno atraso de 500ms para simular o tempo de pensamento do robô (Melhor UX)
      const timer = setTimeout(() => {
        // Agora passa dinamicamente a dificuldade selecionada nas configurações para decidir a jogada!
        const aiMove = getAIMove(squares, gameConfig.boardSize, gameConfig.difficulty);
        
        if (aiMove !== null) {
          handlePlay(aiMove); // Executa a jogada calculada simulando o clique do robô
        }
      }, 500);

      return () => clearTimeout(timer); // Limpa o timer caso o componente mude de estado rápido demais
    }
  }, [squares, xIsNext, gameConfig, gameStarted, winner, isDraw]);

  // --- FUNÇÃO: ADICIONA OS PONTOS E VALIDA O ALVO DE VITÓRIAS ---
  function handleNextGame() {
    let updatedScores = { ...scores };
    if (winner === 'X') {
      updatedScores.player1 += 1;
    } else if (winner === 'O') {
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
    nextSquares[index] = xIsNext ? 'X' : 'O';
    
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
            <span>{gameConfig.player1}:</span> 
            <strong>{scores.player1} {scores.player1 === 1 ? 'vitória' : 'vitórias'}</strong>
          </p>
          <p>
            <span>{gameConfig.player2}:</span> 
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

  // 4. Montagem dinâmica do status da rodada
  let statusText;
  if (winner) {
    const winnerName = winner === 'X' ? gameConfig.player1 : gameConfig.player2;
    statusText = `🎉 Vencedor da Rodada: ${winnerName} (${winner})!`;
  } else if (isDraw) {
    statusText = "👵 Deu Velha! Empate na rodada!";
  } else {
    const currentPlayerName = xIsNext ? gameConfig.player1 : gameConfig.player2;
    const currentSymbol = xIsNext ? 'X' : 'O';
    statusText = `Turno de: ${currentPlayerName} (${currentSymbol})`;
  }

  const willNextGameEndSeries = (winner === 'X' && scores.player1 + 1 === gameConfig.maxGames) || 
                                (winner === 'O' && scores.player2 + 1 === gameConfig.maxGames);

  return (
    <div className="game-wrapper">
      {/* Placar dinâmico no topo */}
      <div className={styles.scoreHeader}>
        <div className={styles.seriesProgress}>
          Partida Atual: <strong>#{currentGameCount}</strong> — Alvo da Série: <strong>{gameConfig.maxGames} Vitórias</strong>
        </div>
        <div className={styles.scoreBoard}>
          <span>{gameConfig.player1}: {scores.player1}</span>
          <span className={styles.scoreDivider}>|</span>
          <span>Velhas: {scores.ties}</span>
          <span className={styles.scoreDivider}>|</span>
          <span>{gameConfig.player2}: {scores.player2}</span>
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




