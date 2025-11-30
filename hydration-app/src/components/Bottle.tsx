import { useEffect, useState } from 'react';
import styles from './Bottle.module.css';

interface BottleProps {
    currentWater: number;
    dailyGoal: number;
    isBottleActive: boolean;
    statusText: string;
}

export default function Bottle({ currentWater, dailyGoal, isBottleActive, statusText }: BottleProps) {
    const bottleHeight = 440;
    // Ensure water doesn't overflow visually
    const percentage = Math.min(currentWater / dailyGoal, 1);
    const waterHeight = percentage * bottleHeight;

    // Generate random bubbles
    const [bubbles, setBubbles] = useState<{id: number, left: number, size: number, delay: number}[]>([]);

    useEffect(() => {
        if (isBottleActive) {
            const interval = setInterval(() => {
                const newBubble = {
                    id: Date.now(),
                    left: Math.random() * 80 + 10, // 10% to 90%
                    size: Math.random() * 10 + 5,
                    delay: Math.random() * 2
                };
                setBubbles(prev => [...prev.slice(-10), newBubble]);
            }, 500);
            return () => clearInterval(interval);
        } else {
            setBubbles([]);
        }
    }, [isBottleActive]);

    return (
        <div className={styles.bottleWrapper}>
            <div className={`${styles.bottle} ${isBottleActive ? styles.bottleActive : ''}`} id="bottle">
                <div className={styles.waterContainer} style={{ height: `${waterHeight}px` }}>
                    <div className={styles.water}></div>
                    {isBottleActive && (
                        <div className={styles.bubbles}>
                            {bubbles.map(b => (
                                <div
                                    key={b.id}
                                    className={styles.bubble}
                                    style={{
                                        left: `${b.left}%`,
                                        width: `${b.size}px`,
                                        height: `${b.size}px`,
                                        animationDelay: `${b.delay}s`
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <span className={styles.waterAmount}>{currentWater} mL</span>
            </div>
            <div className={`${styles.status} ${isBottleActive ? styles.statusActive : ''}`}>
                {statusText}
            </div>
        </div>
    );
}
