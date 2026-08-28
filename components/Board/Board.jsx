
import Square from '../Square/Square';
/**
 * Componente Board (Tabuleiro)
 * Renderiza dinamicamente uma grade NxN de quadrados baseada no tamanho do array de estado.
 * Responsável por gerenciar a disposição visual das linhas e colunas e repassar eventos de clique.
 *
 * @component
 * @param {Object} props - Propriedades do componente.
 * @param {Array<string|null>} props.squares - Array unidimensional contendo o estado atual do tabuleiro.
 * @param {Function} props.onPlay - Função de callback disparada ao clicar em um quadrado, recebendo o índice dele.
 * @returns {JSX.Element} O tabuleiro renderizado dinamicamente.
 */
export default function Board({ squares, onPlay }) {
  // Calcula a dimensão N do tabuleiro (ex: se squares.length é 16, boardSize é 4)
  const boardSize = Math.sqrt(squares.length);
  // Cria um array iterável de tamanho N para mapear as linhas
  const rows = Array(boardSize).fill(null);

  return (
    <div className="board">
      {rows.map((_, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {rows.map((_, colIndex) => {
            const squareIndex = rowIndex * boardSize + colIndex;

            return (
              <Square
                key={squareIndex}
                index={squareIndex}
                value={squares[squareIndex]}
                onSquareClick={() => onPlay(squareIndex)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}