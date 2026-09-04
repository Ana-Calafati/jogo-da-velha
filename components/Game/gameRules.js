// src/components/Game/gameRules.js

// Função para gerar as combinações horizontais, verticais e diagonais de vitória
export function generateWinningCombinations(boardSize) {
  const lines = [];

  // 1. Horizontais (Linhas)
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(i * boardSize + j);
    }
    lines.push(row);
  }

  // 2. Verticais (Colunas)
  for (let i = 0; i < boardSize; i++) {
    const col = [];
    for (let j = 0; j < boardSize; j++) {
      col.push(j * boardSize + i);
    }
    lines.push(col);
  }

  // 3. Diagonal Principal (Superior Esquerda para Inferior Direita)
  const diag1 = [];
  for (let i = 0; i < boardSize; i++) {
    diag1.push(i * boardSize + i);
  }
  lines.push(diag1);

  // 4. Diagonal Secundária (Superior Direita para Inferior Esquerda)
  const diag2 = [];
  for (let i = 0; i < boardSize; i++) {
    diag2.push(i * boardSize + (boardSize - 1 - i));
  }
  lines.push(diag2);

  return lines;
}

// Função que julga a partida e retorna o vencedor ('X', 'O') ou null
export function calculateWinner(squares, boardSize) {
  if (!squares || squares.length === 0) return null;

  const lines = generateWinningCombinations(boardSize);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const firstSymbol = squares[line[0]];

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
 * FUNÇÃO PRINCIPAL DA IA: Decide a jogada baseada no nível de dificuldade selecionado.
 */
export function getAIMove(squares, boardSize, difficulty) {
  if (difficulty === 'medium') {
    return getMediumAIMove(squares, boardSize);
  }
  if (difficulty === 'hard' && boardSize === 3) {
    return getHardAIMove(squares, boardSize);
  }
  // Padrão ou Tabuleiros grandes (4x4 a 6x6): usa o modo aleatório/médio por performance
  return getRandomAIMove(squares);
}

// --- NÍVEL FÁCIL: Escolha aleatória ---
function getRandomAIMove(squares) {
  const emptyIndices = squares
    .map((square, index) => (square === null ? index : null))
    .filter((val) => val !== null);

  if (emptyIndices.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * emptyIndices.length);
  return emptyIndices[randomIndex];
}

// --- NÍVEL MÉDIO: Tenta ganhar ou bloquear o jogador ---
function getMediumAIMove(squares, boardSize) {
  const lines = generateWinningCombinations(boardSize);

  // 1. CHANCE DE GANHAR: Vê se a IA ('O') tem uma linha com apenas 1 casa vazia para vencer
  for (const line of lines) {
    const symbolsInLine = line.map(index => squares[index]);
    const oCount = symbolsInLine.filter(s => s === 'O').length;
    const nullCount = symbolsInLine.filter(s => s === null).length;

    if (oCount === boardSize - 1 && nullCount === 1) {
      return line[symbolsInLine.indexOf(null)];
    }
  }

  // 2. BLOQUEIO: Vê se o Jogador ('X') está prestes a ganhar e fecha a casa dele
  for (const line of lines) {
    const symbolsInLine = line.map(index => squares[index]);
    const xCount = symbolsInLine.filter(s => s === 'X').length;
    const nullCount = symbolsInLine.filter(s => s === null).length;

    if (xCount === boardSize - 1 && nullCount === 1) {
      return line[symbolsInLine.indexOf(null)];
    }
  }

  // 3. Se não tiver ataque nem defesa urgente, joga em uma casa aleatória
  return getRandomAIMove(squares);
}

// --- NÍVEL DIFÍCIL: Algoritmo Minimax Imbatível (Apenas para 3x3) ---
function getHardAIMove(squares, boardSize) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = 'O'; // Simula jogada da IA
      let score = minimax(squares, boardSize, 0, false);
      squares[i] = null; // Desfaz simulação

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove !== null ? bestMove : getRandomAIMove(squares);
}

function minimax(squares, boardSize, depth, isMaximizing) {
  const winner = calculateWinner(squares, boardSize);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (squares.every(s => s !== null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        let score = minimax(squares, boardSize, depth + 1, false);
        squares[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = 'X';
        let score = minimax(squares, boardSize, depth + 1, true);
        squares[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

