import styles from './Stats.module.css';

interface StatsProps {
    dailyGoal: number;
    totalDailyWater: number;
}

export default function Stats({ dailyGoal, totalDailyWater }: StatsProps) {
    const percentage = Math.min((totalDailyWater / dailyGoal) * 100, 100);

    return (
        <div className={styles.stats}>
            <div className={styles.statRow}>
                <span className={styles.statLabel}>Daily Goal</span>
                <span className={styles.statValue}>{dailyGoal} mL</span>
            </div>
            <div className={styles.statRow}>
                <span className={styles.statLabel}>Progress</span>
                <span className={styles.statValue}>{totalDailyWater} mL</span>
            </div>
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
            </div>
            <div className={styles.percentage}>{Math.round(percentage)}% Complete</div>
        </div>
    );
}
