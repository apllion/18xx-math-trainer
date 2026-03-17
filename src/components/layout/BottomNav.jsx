import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';

const tabs = [
  { to: '/drills', label: 'Drills', icon: '⚡' },
  { to: '/cheatsheet', label: 'Cheat Sheet', icon: '📋' },
  { to: '/schedule', label: 'Schedule', icon: '📅' },
  { to: '/postmortem', label: 'Post-Mortem', icon: '📝' },
];

export default function BottomNav() {
  return (
    <nav className={styles.nav}>
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>{icon}</span>
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
