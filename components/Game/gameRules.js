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
      // Confere se TODAS as casas daquela combinação específica têm o mesmo símbolo
      const isWinningLine = line.every(index => squares[index] === firstSymbol);
      if (isWinningLine) {
        return firstSymbol; 
      }
    }
  }

  return null; 
}

/**
 * Escolhe uma casa vazia aleatória no tabuleiro para a IA jogar.
 * Funciona dinamicamente para qualquer tamanho de tabuleiro (3x3 até 6x6).
 * @param {Array} squares - O array atual do tabuleiro
 * @returns {Number|null} O índice da casa escolhida ou null se não houver espaço
 */
export function getRandomAIMove(squares) {
  // Filtra os índices de todas as casas que ainda estão vazias (null)
  const emptyIndices = squares
    .map((square, index) => (square === null ? index : null))
    .filter((val) => val !== null);

  if (emptyIndices.length === 0) return null;

  // Sorteia uma das posições vazias disponíveis
  const randomIndex = Math.floor(Math.random() * emptyIndices.length);
  return emptyIndices[randomIndex];
}
