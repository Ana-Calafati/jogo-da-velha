import { useState } from 'react';
import styles from './GameConfig.module.css';

/**
 * Componente de formulário para configurar as opções da partida.
 * @param {Object} props
 * @param {Function} props.onStartGame - Função do Game.jsx acionada ao enviar o formulário
 */
export default function GameConfig({ onStartGame }) {
  // 1. Estado inicial unificado com os novos campos de símbolos/emojis
  const [formData, setFormData] = useState({
    gameMode: 'pvp',
    player1: 'Jogador 1',
    player2: 'Jogador 2',
    boardSize: 3,
    maxGames: 1,
    difficulty: 'easy',
    player1Symbol: '❌', // Símbolo padrão J1
    player2Symbol: '⭕'  // Símbolo padrão J2
  });

  // Lista de emojis disponíveis para escolha
  const emojiList = ['❌', '⭕', '🚀', '👾', '🔥', '🦄', '🍕', '👻', '👑', '💎', '🦖', '🐱'];

  // 2. Função genérica que atualiza o estado e já trata a tipagem numérica
  function handleChange(event) {
    const { name, value } = event.target;

    const finalValue = (name === 'boardSize' || name === 'maxGames') 
      ? Number(value) 
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue
    }));
  }

  // 3. Função acionada ao submeter o formulário
  function handleSubmit(event) {
    event.preventDefault();

    // Validação da regra de negócio: modo IA exige nome fixo no player2
    const finalPlayer2 = formData.gameMode === 'ai' ? 'Robô 🤖' : formData.player2;

    const configData = {
      ...formData,
      player2: finalPlayer2
    };

    onStartGame(configData);
  }

  return (
    <form className={styles.configForm} onSubmit={handleSubmit}>
      <h2>Configurações do Jogo ⚙️</h2>

      {/* Select: Modo de Jogo */}
      <div className={styles.formGroup}>
        <label htmlFor="gameMode">Modo de Jogo:</label>
        <select id="gameMode" name="gameMode" value={formData.gameMode} onChange={handleChange}>
          <option value="pvp">Jogador vs Jogador (PvP)</option>
          <option value="ai">Jogador vs IA (PvA)</option>
        </select>
      </div>

      {/* Inputs de Nomes */}
      <div className={styles.formGroup}>
        <label htmlFor="player1">Nome do Jogador 1:</label>
        <input id="player1" type="text" name="player1" value={formData.player1} onChange={handleChange} required />
      </div>

      {formData.gameMode !== 'ai' && (
        <div className={styles.formGroup}>
          <label htmlFor="player2">Nome do Jogador 2:</label>
          <input id="player2" type="text" name="player2" value={formData.player2} onChange={handleChange} required />
        </div>
      )}

      {/* NOVOS CAMPOS: Escolha de Emojis/Símbolos */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className={styles.formGroup} style={{ flex: 1 }}>
          <label htmlFor="player1Symbol">Símbolo {formData.player1}:</label>
          <select id="player1Symbol" name="player1Symbol" value={formData.player1Symbol} onChange={handleChange}>
            {emojiList.map(emoji => (
              <option key={emoji} value={emoji} disabled={emoji === formData.player2Symbol}>
                {emoji}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup} style={{ flex: 1 }}>
          <label htmlFor="player2Symbol">Símbolo {formData.gameMode === 'ai' ? 'Robô 🤖' : formData.player2}:</label>
          <select id="player2Symbol" name="player2Symbol" value={formData.player2Symbol} onChange={handleChange}>
            {emojiList.map(emoji => (
              <option key={emoji} value={emoji} disabled={emoji === formData.player1Symbol}>
                {emoji}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Select de Dificuldade da IA */}
      {formData.gameMode === 'ai' && (
        <div className={styles.formGroup}>
          <label htmlFor="difficulty">Dificuldade da IA:</label>
          <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option value="easy">Fácil 🥴 (Aleatório)</option>
            <option value="medium">Médio 🤔 (Bloqueia e Ataca)</option>
            <option value="hard">Difícil 🧠 (Imbatível / Minimax)</option>
          </select>
        </div>
      )}

      {/* Select: Tamanho do Tabuleiro */}
      <div className={styles.formGroup}>
        <label htmlFor="boardSize">Tamanho do Tabuleiro:</label>
        <select id="boardSize" name="boardSize" value={formData.boardSize} onChange={handleChange}>
          <option value="3">3x3 (Padrão)</option>
          <option value="4">4x4</option>
          <option value="5">5x5</option>
          <option value="6">6x6</option>
        </select>
      </div>

      {/* Input: Limite de Partidas */}
      <div className={styles.formGroup}>
        <label htmlFor="maxGames">Vitórias necessárias (Série):</label>
        <input id="maxGames" type="number" name="maxGames" min="1" max="10" value={formData.maxGames} onChange={handleChange} required />
      </div>

      <button type="submit" className={styles.submitBtn}>
        Iniciar Partida 🎮
      </button>
    </form>
  );
}

