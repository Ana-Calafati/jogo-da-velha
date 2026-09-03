import { useState } from 'react';
import styles from './GameConfig.module.css';


/**
 * Componente de formulário para configurar as opções da partida.
 * @param {Object} props
 * @param {Function} props.onStartGame - Função do Game.jsx acionada ao enviar o formulário
 */
export default function GameConfig({ onStartGame }) {
  // 1. Estado inicial unificado com os tipos corretos (números para boardSize e maxGames)
  const [formData, setFormData] = useState({
    gameMode: 'pvp',
    player1: 'Jogador 1',
    player2: 'Jogador 2',
    boardSize: 3,
    maxGames: 1
  });

  // 2. Função genérica que atualiza o estado e já trata a tipagem numérica
  function handleChange(event) {
    const { name, value } = event.target;

    // Converte para número se for boardSize ou maxGames, senão mantém como string
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

    // Monta o objeto final (dados já vêm tipados corretamente do estado)
    const configData = {
      ...formData,
      player2: finalPlayer2
    };

    // Envia as configurações para o componente pai (Game.jsx)
    onStartGame(configData);
  }

  return (
    <form className={styles.configForm} onSubmit={handleSubmit}>
      <h2>Configurações do Jogo ⚙️</h2>

      {/* Select: Modo de Jogo */}
      <div className={styles.formGroup}>
        <label htmlFor="gameMode">Modo de Jogo:</label>
        <select
          id="gameMode"
          name="gameMode"
          value={formData.gameMode}
          onChange={handleChange}
        >
          <option value="pvp">Jogador vs Jogador (PvP)</option>
          <option value="ai">Jogador vs IA (PvA)</option>
        </select>
      </div>

      {/* Input: Nome Jogador 1 */}
      <div className={styles.formGroup}>
        <label htmlFor="player1">Nome do Jogador 1 (X):</label>
        <input
          id="player1"
          type="text"
          name="player1"
          value={formData.player1}
          onChange={handleChange}
          required
        />
      </div>

      {/* Input: Nome Jogador 2 (Exibido apenas se gameMode NÃO for 'ai') */}
      {formData.gameMode !== 'ai' && (
        <div className={styles.formGroup}>
          <label htmlFor="player2">Nome do Jogador 2 (O):</label>
          <input
            id="player2"
            type="text"
            name="player2"
            value={formData.player2}
            onChange={handleChange}
            required
          />
        </div>
      )}

      {/* Select: Tamanho do Tabuleiro (3 a 6) */}
      <div className={styles.formGroup}>
        <label htmlFor="boardSize">Tamanho do Tabuleiro:</label>
        <select
          id="boardSize"
          name="boardSize"
          value={formData.boardSize}
          onChange={handleChange}
        >
          <option value="3">3x3 (Padrão)</option>
          <option value="4">4x4</option>
          <option value="5">5x5</option>
          <option value="6">6x6</option>
        </select>
      </div>

      {/* Input: Limite de Partidas (1 a 10) */}
      <div className={styles.formGroup}>
        <label htmlFor="maxGames">Vitórias necessárias (Série):</label>
        <input
          id="maxGames"
          type="number"
          name="maxGames"
          min="1"
          max="10"
          value={formData.maxGames}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        Iniciar Partida 🎮
      </button>
    </form>
  );
}
