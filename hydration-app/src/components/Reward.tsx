import styles from './Reward.module.css';

interface RewardProps {
    percentage: number;
}

const rewards = [
    { threshold: 0, emoji: '🐟', name: 'Fish Tank' },
    { threshold: 33, emoji: '🏊', name: 'Swimming Pool' },
    { threshold: 66, emoji: '🏖️', name: 'Bay' },
    { threshold: 100, emoji: '🌊', name: 'Ocean' }
];

export default function Reward({ percentage }: RewardProps) {
    let currentReward = rewards[0];
    for (const reward of rewards) {
        if (percentage >= reward.threshold) {
            currentReward = reward;
        }
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>🏆 Current Reward</div>
            <div className={styles.rewardDisplay}>
                <div className={styles.rewardEmoji}>{currentReward.emoji}</div>
                <div className={styles.rewardName}>{currentReward.name}</div>
                <div className={styles.rewardTier}>Keep hydrating!</div>
            </div>
        </div>
    );
}
