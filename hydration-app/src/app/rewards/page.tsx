'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './rewards.module.css';

interface HydrationData {
    date: string;
    totalDailyWater: number;
    currentWater: number;
    dailyGoal: number;
    mlPerSecond: number;
}

// Lake Michigan volume: 4,920 km³ = 4,920,000,000,000,000 mL
const LAKE_MICHIGAN_VOLUME_ML = 4920000000000000;

const rewards = [
    { threshold: 0, emoji: '🐟', name: 'Fish Tank', description: 'Starting your journey!' },
    { threshold: 33, emoji: '🏊', name: 'Swimming Pool', description: 'Making great progress!' },
    { threshold: 66, emoji: '🏖️', name: 'Bay', description: 'You\'re almost there!' },
    { threshold: 100, emoji: '🌊', name: 'Ocean', description: 'Daily goal achieved!' }
];

export default function RewardsPage() {
    const [totalDailyWater, setTotalDailyWater] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(3000);
    const [allTimeTotal, setAllTimeTotal] = useState(0);

    useEffect(() => {
        // Load today's data
        const saved = localStorage.getItem('hydrationData');
        if (saved) {
            try {
                const data: HydrationData = JSON.parse(saved);
                const today = new Date().toDateString();

                if (data.date === today) {
                    setTotalDailyWater(data.totalDailyWater || 0);
                }
                setDailyGoal(data.dailyGoal || 3000);
            } catch (e) {
                console.error("Failed to parse saved data", e);
            }
        }

        // Load all-time total
        const allTimeSaved = localStorage.getItem('allTimeWater');
        if (allTimeSaved) {
            setAllTimeTotal(parseInt(allTimeSaved));
        }
    }, []);

    const percentage = Math.min((totalDailyWater / dailyGoal) * 100, 100);
    
    // Calculate Lake Michigan progress
    const lakeMichiganPercentage = (allTimeTotal / LAKE_MICHIGAN_VOLUME_ML) * 100;
    const lakeMichiganLiters = allTimeTotal / 1000; // Convert mL to liters
    const lakeMichiganGallons = lakeMichiganLiters * 0.264172; // Convert to gallons

    // Determine current reward
    let currentReward = rewards[0];
    for (const reward of rewards) {
        if (percentage >= reward.threshold) {
            currentReward = reward;
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>🏆 Your Hydration Rewards</h1>
                <Link href="/" className={styles.backBtn}>
                    ← Back to Tracker
                </Link>
            </div>

            <div className={styles.content}>
                {/* Today's Achievement */}
                <div className={styles.todaySection}>
                    <h2>Today's Achievement</h2>
                    <div className={styles.currentReward}>
                        <div className={styles.rewardEmoji}>{currentReward.emoji}</div>
                        <div className={styles.rewardName}>{currentReward.name}</div>
                        <div className={styles.rewardDescription}>{currentReward.description}</div>
                        <div className={styles.progressText}>
                            {totalDailyWater} mL / {dailyGoal} mL ({Math.round(percentage)}%)
                        </div>
                    </div>
                </div>

                {/* All Rewards Grid */}
                <div className={styles.rewardsGrid}>
                    <h2>All Rewards</h2>
                    <div className={styles.grid}>
                        {rewards.map((reward, index) => (
                            <div
                                key={index}
                                className={`${styles.rewardCard} ${
                                    percentage >= reward.threshold ? styles.unlocked : styles.locked
                                }`}
                            >
                                <div className={styles.cardEmoji}>{reward.emoji}</div>
                                <div className={styles.cardName}>{reward.name}</div>
                                <div className={styles.cardThreshold}>
                                    {reward.threshold === 100 ? 'Goal Complete!' : `${reward.threshold}% Progress`}
                                </div>
                                {percentage >= reward.threshold ? (
                                    <div className={styles.unlockedBadge}>✓ Unlocked</div>
                                ) : (
                                    <div className={styles.lockedBadge}>🔒 Locked</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lake Michigan Progress */}
                <div className={styles.lakeMichiganSection}>
                    <h2>🌊 Draining Lake Michigan Challenge</h2>
                    <div className={styles.lakeStats}>
                        <div className={styles.lakeStat}>
                            <div className={styles.lakeValue}>
                                {lakeMichiganLiters.toLocaleString(undefined, { 
                                    maximumFractionDigits: 2 
                                })} L
                            </div>
                            <div className={styles.lakeLabel}>Total Water Consumed</div>
                        </div>
                        <div className={styles.lakeStat}>
                            <div className={styles.lakeValue}>
                                {lakeMichiganGallons.toLocaleString(undefined, { 
                                    maximumFractionDigits: 2 
                                })} gal
                            </div>
                            <div className={styles.lakeLabel}>In Gallons</div>
                        </div>
                        <div className={styles.lakeStat}>
                            <div className={styles.lakeValue}>
                                {lakeMichiganPercentage.toExponential(2)}%
                            </div>
                            <div className={styles.lakeLabel}>of Lake Michigan</div>
                        </div>
                    </div>
                    
                    <div className={styles.lakeVisualization}>
                        <div className={styles.lakeInfo}>
                            <p>Lake Michigan contains approximately <strong>4,920 km³</strong> of water.</p>
                            <p>That's <strong>1.3 quadrillion gallons</strong> or <strong>4.92 quadrillion liters</strong>!</p>
                            <p className={styles.funFact}>
                                At your current pace, you've contributed <strong>
                                {(allTimeTotal / 1000000).toFixed(6)} cubic meters
                                </strong> towards draining the lake!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Motivational Message */}
                <div className={styles.motivationSection}>
                    <p className={styles.motivationText}>
                        Keep up the great work! Every drop counts towards better hydration and health! 💪💧
                    </p>
                </div>
            </div>
        </div>
    );
}

