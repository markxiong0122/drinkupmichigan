import styles from './Reward.module.css';

interface RewardProps {
    percentage: number;
    totalDailyWater: number;
    dailyGoal: number;
    allTimeWater: number;
}

const LAKE_MICHIGAN_VOLUME_ML = 4920000000000000;

const rewards = [
    { threshold: 0, emoji: '🐟', name: 'Fish Tank', description: 'Starting your journey!' },
    { threshold: 33, emoji: '🏊', name: 'Swimming Pool', description: 'Making great progress!' },
    { threshold: 66, emoji: '🏖️', name: 'Bay', description: 'You\'re almost there!' },
    { threshold: 100, emoji: '🌊', name: 'Ocean', description: 'Daily goal achieved!' }
];

export default function Reward({ percentage, totalDailyWater, dailyGoal, allTimeWater }: RewardProps) {
    const lakeMichiganPercentage = (allTimeWater / LAKE_MICHIGAN_VOLUME_ML) * 100;
    const lakeMichiganLiters = allTimeWater / 1000;
    
    let currentReward = rewards[0];
    for (const reward of rewards) {
        if (percentage >= reward.threshold) {
            currentReward = reward;
        }
    }

    return (
        <div className={styles.container}>
            {/* Daily Progress */}
            <div className={styles.card}>
                <div className={styles.cardTitle}>🏆 Current Status</div>
                <div className={styles.rewardDisplay}>
                    <div className={styles.rewardEmoji}>{currentReward.emoji}</div>
                    <div className={styles.rewardName}>{currentReward.name}</div>
                    <div className={styles.rewardDescription}>{currentReward.description}</div>
                    <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                            <div 
                                className={styles.progressFill} 
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                        <div className={styles.progressText}>
                            {totalDailyWater} / {dailyGoal} mL ({Math.round(percentage)}%)
                        </div>
                    </div>
                </div>
                
                {/* Mini Rewards Grid */}
                <div className={styles.miniGrid}>
                    {rewards.map((reward, index) => (
                        <div 
                            key={index} 
                            className={`${styles.miniReward} ${percentage >= reward.threshold ? styles.unlocked : ''}`}
                            title={reward.name}
                        >
                            <div className={styles.miniEmoji}>{reward.emoji}</div>
                            <div className={styles.miniThreshold}>{reward.threshold === 100 ? '100' : reward.threshold}%</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lake Michigan Challenge */}
            <div className={`${styles.card} ${styles.lakeCard}`}>
                <div className={styles.cardTitle}>🌊 Lake Michigan Goal</div>
                <div className={styles.lakeStats}>
                    <div className={styles.lakeStat}>
                        <div className={styles.lakeValue}>{lakeMichiganLiters.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        <div className={styles.lakeLabel}>Liters Total</div>
                    </div>
                    <div className={styles.lakeStat}>
                        <div className={styles.lakeValue}>{lakeMichiganPercentage.toExponential(2)}%</div>
                        <div className={styles.lakeLabel}>of Lake</div>
                    </div>
                </div>
                <div className={styles.lakeNote}>
                    Contributing to draining 4,920 km³ of water!
                </div>
            </div>
        </div>
    );
}
