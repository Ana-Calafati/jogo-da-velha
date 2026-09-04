// src/components/Game/gameRules.js

export function generateWinningCombinations(boardSize) {
  const lines = [];

  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(i * boardSize + j);
    }
    lines.push(row);
  }

  for (let i = 0; i < boardSize; i++) {
    const col = [];
    for (let j = 0; j < boardSize; j++) {
      col.push(j * boardSize + i);
    }
    lines.push(col);
  }

  const diag1 = [];
  for (let i = 0; i < boardSize; i++) {
    diag1.push(i * boardSize + i);
  }
  lines.push(diag1);

  const diag2 = [];
  for (let i = 0; i < boardSize; i++) {
    diag2.push(i * boardSize + (boardSize - 1 - i));
  }
  lines.push(diag2);

  return lines;
}

export function calculateWinner(squares, boardSize) {
  if (!squares || squares.length === 0) return null;

  const lines = generateWinningCombinations(boardSize);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const firstSymbol = squares[line[0]]; // Correção de indexação para pegar o símbolo real

    if (firstSymbol) {
      const isWinningLine = line.every(index => squares[index] === firstSymbol);
      if (isWinningLine) {
        return firstSymbol; 
      }
    }
  }

  return null; 
}

/**
 * FUNÇÃO PRINCIPAL DA IA: Agora recebe dinamicamente os símbolos dos jogadores.
 */
export function getAIMove(squares, boardSize, difficulty, aiSymbol = '⭕', playerSymbol = '❌') {
  if (difficulty === 'medium') {
    return getMediumAIMove(squares, boardSize, aiSymbol, playerSymbol);
  }
  if (difficulty === 'hard' && boardSize === 3) {
    return getHardAIMove(squares, boardSize, aiSymbol, playerSymbol);
  }
  return getRandomAIMove(squares);
}

function getRandomAIMove(squares) {
  const emptyIndices = squares
    .map((square, index) => (square === null ? index : null))
    .filter((val) => val !== null);

  if (emptyIndices.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * emptyIndices.length);
  return emptyIndices[randomIndex];
}

// --- NÍVEL MÉDIO: Ataca e defende usando os emojis customizados ---
function getMediumAIMove(squares, boardSize, aiSymbol, playerSymbol) {
  const lines = generateWinningCombinations(boardSize);

  // 1. CHANCE DE GANHAR (Ataque)
  for (const line of lines) {
    const symbolsInLine = line.map(index => squares[index]);
    const aiCount = symbolsInLine.filter(s => s === aiSymbol).length;
    const nullCount = symbolsInLine.filter(s => s === null).length;

    if (aiCount === boardSize - 1 && nullCount === 1) {
      return line[symbolsInLine.indexOf(null)];
    }
  }

  // 2. BLOQUEIO (Defesa)
  for (const line of lines) {
    const symbolsInLine = line.map(index => squares[index]);
    const playerCount = symbolsInLine.filter(s => s === playerSymbol).length;
    const nullCount = symbolsInLine.filter(s => s === null).length;

    if (playerCount === boardSize - 1 && nullCount === 1) {
      return line[symbolsInLine.indexOf(null)];
    }
  }

  return getRandomAIMove(squares);
}

// --- NÍVEL DIFÍCIL: Minimax parametrizado com emojis customizados ---
function getHardAIMove(squares, boardSize, aiSymbol, playerSymbol) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = aiSymbol; 
      let score = minimax(squares, boardSize, 0, false, aiSymbol, playerSymbol);
      squares[i] = null; 

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove !== null ? bestMove : getRandomAIMove(squares);
}

function minimax(squares, boardSize, depth, isMaximizing, aiSymbol, playerSymbol) {
  const winner = calculateWinner(squares, boardSize);
  if (winner === aiSymbol) return 10 - depth;
  if (winner === playerSymbol) return depth - 10;
  if (squares.every(s => s !== null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = aiSymbol;
        let score = minimax(squares, boardSize, depth + 1, false, aiSymbol, playerSymbol);
        squares[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = playerSymbol;
        let score = minimax(squares, boardSize, depth + 1, true, aiSymbol, playerSymbol);
        squares[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}


