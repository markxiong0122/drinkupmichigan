import styles from './Bottle.module.css';

interface BottleProps {
    currentWater: number;
    dailyGoal: number;
    isBottleActive: boolean;
    isDrinking?: boolean;
    statusText: string;
}

export default function Bottle({ currentWater, dailyGoal, isBottleActive, isDrinking, statusText }: BottleProps) {
    const percentage = Math.min((currentWater / dailyGoal) * 100, 100);

    return (
        <div className={styles.bottleContainer}>
            <div className={`${styles.bottle} ${isBottleActive ? styles.holding : ''} ${isDrinking ? styles.drinking : ''}`}>
                <div 
                    className={styles.water} 
                    style={{ height: `${percentage}%` }}
                >
                </div>
                <span className={styles.waterAmount}>{currentWater} mL</span>
            </div>
        </div>
    );
}
