import styles from './Card.module.css';

export default function Card({ children, className = '', variant = 'default', ...props }) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
