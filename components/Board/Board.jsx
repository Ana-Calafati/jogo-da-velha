import React from 'react';
import styles from './Board.module.css'; // 1. Garanta esta importação exata!

export default function Board({ boardSize, squares, onPlay, status }) {
  return (
    <div className={styles.boardContainer}> {/* 2. Usando o container centralizado */}
      <div className={styles.statusInfo}>{status}</div> {/* 3. Status amarelo */}
      
      {/* 4. Passando a variável de tamanho para o CSS Grid */}
      <div 
        className={styles.grid} 
        style={{ '--board-size': boardSize }}
      >
        {squares.map((square, i) => (
          <button 
            key={i} 
            className={styles.square} // 5. Classe de estilo do quadrado
            data-player={square} // 6. Pinta X de rosa/vermelho e O de amarelo ouro
            onClick={() => onPlay(i)}
            disabled={square !== null}
          >
            {square}
          </button>
        ))}
      </div>
    </div>
  );
}
