import styles from './Instructions.module.css';

export default function Instructions() {
    return (
        <div className={styles.instructions}>
            <h3>Controls</h3>
            <div className={styles.keyRow}>
                <span className={styles.key}>↑</span>
                <span>Hold mug</span>
            </div>
            <div className={styles.keyRow}>
                <span className={styles.key}>↓</span>
                <span>Drink water</span>
            </div>
            <div className={styles.keyRow}>
                <span className={styles.key}>Space</span>
                <span>Put mug down</span>
            </div>
        </div>
    );
}
