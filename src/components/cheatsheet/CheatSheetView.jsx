import { useState } from 'react';
import srItems from '../../data/cheatsheets/sr';
import orItems from '../../data/cheatsheets/or';
import endgameItems from '../../data/cheatsheets/endgame';
import { getGame } from '../../data/games';
import PhaseCard from './PhaseCard';
import GameDataCard from './GameDataCard';
import styles from './CheatSheetView.module.css';

const TABS = [
  { id: 'sr', label: 'Stock Round' },
  { id: 'or', label: 'Operating Round' },
  { id: 'endgame', label: 'End-Game' },
  { id: 'gamedata', label: 'Game Data' },
];

const TAB_DATA = { sr: srItems, or: orItems, endgame: endgameItems };

export default function CheatSheetView({ selectedGame }) {
  const [activeTab, setActiveTab] = useState('sr');
  const gameData = getGame(selectedGame);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Cheat Sheet</h2>
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === 'gamedata' ? (
          <GameDataCard gameData={gameData} />
        ) : (
          TAB_DATA[activeTab]?.map((item, i) => (
            <PhaseCard key={i} item={item} gameId={selectedGame} />
          ))
        )}
      </div>
    </div>
  );
}
