return (
  <div className={styles.game}>
    <div className={styles.gameBoard}>
      <Board 
        squares={currentSquares} 
        boardSize={boardSize} 
        onClick={handleSquareClick} 
        xIsNext={xIsNext} 
      />
    </div>
    <div className={styles.gameInfo}>
      <History history={history} onJumpTo={jumpTo} />
    </div>
  </div>
);