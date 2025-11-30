import styles from './Instructions.module.css';

export default function Instructions() {
    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>🎮 Controls</div>
            <div className={styles.instructionsGrid}>
                <div className={styles.instructionItem}>
                    <div className={styles.keyBadge}>↑ UP</div>
                    <div className={styles.instructionText}>
                        Hold to <span className={styles.instructionHighlight}>pick up cup</span>
                    </div>
                </div>
                <div className={styles.instructionItem}>
                    <div className={styles.keyBadge}>↓ DOWN</div>
                    <div className={styles.instructionText}>
                        Hold to <span className={styles.instructionHighlight}>drink water</span>
                    </div>
                </div>
            </div>
            <div className={styles.newMechanicNotice}>
                <div className={styles.noticeTitle}>💡 New Mechanic:</div>
                You must hold BOTH the cup (↑) AND drink button (↓) simultaneously to add water!
            </div>
        </div>
    );
}
