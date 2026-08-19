import React, {
  createContext,
  useContext,
  useState,
} from "react";

const PlayerStatsContext = createContext(null);

export default function PlayerStatsProvider({
  children,
}) {
  const [health, setHealth] = useState(100);
  const [maxHealth] = useState(100);
  const [armor, setArmor] = useState(0);
  const [score, setScore] = useState(0);
  const [enemiesKilled, setEnemiesKilled] = useState(0);

  const damagePlayer = (amount) => {
    const damage = Math.max(
      0,
      Number(amount) || 0
    );

    if (damage <= 0) return;

    setHealth((current) =>
      Math.max(
        0,
        current - damage
      )
    );
  };

  const healPlayer = (amount) => {
    const heal = Math.max(
      0,
      Number(amount) || 0
    );

    if (heal <= 0) return;

    setHealth((current) =>
      Math.min(
        maxHealth,
        current + heal
      )
    );
  };

  const addScore = (amount) => {
    setScore(
      (current) =>
        current + (Number(amount) || 0)
    );
  };

  const addEnemyKill = () => {
    setEnemiesKilled(
      (current) => current + 1
    );

    addScore(100);
  };

  const resetStats = () => {
    setHealth(100);
    setArmor(0);
    setScore(0);
    setEnemiesKilled(0);
  };

  const value = {
    health,
    setHealth,

    maxHealth,

    armor,
    setArmor,

    score,
    setScore,

    enemiesKilled,
    setEnemiesKilled,

    damagePlayer,
    healPlayer,

    addScore,
    addEnemyKill,

    resetStats,
  };

  return (
    <PlayerStatsContext.Provider value={value}>
      {children}
    </PlayerStatsContext.Provider>
  );
}

export function usePlayerStats() {
  const context = useContext(PlayerStatsContext);

  if (!context) {
    throw new Error(
      "usePlayerStats must be used inside PlayerStatsProvider"
    );
  }

  return context;
}
