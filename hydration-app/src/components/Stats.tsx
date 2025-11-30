import styles from './Stats.module.css';

interface StatsProps {
    dailyGoal: number;
    totalDailyWater: number;
}

export default function Stats({ dailyGoal, totalDailyWater }: StatsProps) {
    const percentage = Math.min((totalDailyWater / dailyGoal) * 100, 100);

    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>📊 Daily Progress</div>
            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Daily Goal</span>
                    <span className={styles.statValue}>{dailyGoal} mL</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Consumed Today</span>
                    <span className={styles.statValue}>{totalDailyWater} mL</span>
                </div>
            </div>
            <div className={styles.progressContainer}>
                <div className={styles.progressLabel}>
                    <span>Progress</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        </div>
    );
}
