import React from 'react';
import styles from './Square.module.css';

/**
 * Componente que renderiza um quadrado individual (casa) do tabuleiro.
 * 
 * @component
 * @param {Object} props - Propriedades do componente.
 * @param {string|null} props.value - O valor a ser exibido no quadrado ('X', 'O' ou null).
 * @param {function} props.onSquareClick - Função de callback disparada ao clicar no quadrado.
 * @param {number} props.index - O índice linear da posição deste quadrado no tabuleiro.
 * @returns {React.JSX.Element} Um botão acessível estilizado via CSS Modules.
 */
function Square({ value, onSquareClick, index }) {
  // Define um texto descritivo para leitores de tela dependendo do estado da casa
  const ariaLabelText = value 
    ? `Posição ${index + 1}, marcado com ${value}` 
    : `Posição ${index + 1}, vazia`;

  return (
    <button 
      className={styles.square} 
      onClick={onSquareClick}
      aria-label={ariaLabelText}
    >
      {value}
    </button>
  );
}

export default Square;
