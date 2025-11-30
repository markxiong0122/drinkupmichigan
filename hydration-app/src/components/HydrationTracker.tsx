'use client';

import { useEffect, useRef, useState } from 'react';
import Bottle from './Bottle';
import styles from './HydrationTracker.module.css';
import Instructions from './Instructions';
import Reward from './Reward';
import SettingsModal from './SettingsModal';
import Stats from './Stats';

interface HydrationData {
    date: string;
    totalDailyWater: number;
    currentWater: number;
    dailyGoal: number;
    mlPerSecond: number;
}

export default function HydrationTracker() {
    // State
    const [currentWater, setCurrentWater] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(3000);
    const [mlPerSecond, setMlPerSecond] = useState(50);
    const [totalDailyWater, setTotalDailyWater] = useState(0);
    const [isBottleActive, setIsBottleActive] = useState(false);
    const [isDrinking, setIsDrinking] = useState(false);
    const [statusText, setStatusText] = useState('Put mug down');
    const [showSettings, setShowSettings] = useState(false);

    // Refs for values accessed in event listeners/intervals
    const drinkingStartTimeRef = useRef<number>(0);
    const isBottleActiveRef = useRef(isBottleActive);
    const isDrinkingRef = useRef(isDrinking);
    const mlPerSecondRef = useRef(mlPerSecond);

    // Sync refs with state
    useEffect(() => { isBottleActiveRef.current = isBottleActive; }, [isBottleActive]);
    useEffect(() => { isDrinkingRef.current = isDrinking; }, [isDrinking]);
    useEffect(() => { mlPerSecondRef.current = mlPerSecond; }, [mlPerSecond]);

    // Load data on mount
    useEffect(() => {
        const saved = localStorage.getItem('hydrationData');
        if (saved) {
            try {
                const data: HydrationData = JSON.parse(saved);
                const today = new Date().toDateString();

                if (data.date === today) {
                    setTotalDailyWater(data.totalDailyWater || 0);
                    setCurrentWater(data.currentWater || 0);
                }

                setDailyGoal(data.dailyGoal || 3000);
                setMlPerSecond(data.mlPerSecond || 50);
            } catch (e) {
                console.error("Failed to parse saved data", e);
            }
        }
    }, []);

    // Save data whenever relevant state changes
    useEffect(() => {
        const data: HydrationData = {
            date: new Date().toDateString(),
            totalDailyWater,
            currentWater,
            dailyGoal,
            mlPerSecond
        };
        localStorage.setItem('hydrationData', JSON.stringify(data));
    }, [totalDailyWater, currentWater, dailyGoal, mlPerSecond]);

    // Check for goal completion
    useEffect(() => {
        if (currentWater >= dailyGoal && dailyGoal > 0) {
            const timer = setTimeout(() => {
                setCurrentWater(0);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentWater, dailyGoal]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'ArrowUp') {
                e.preventDefault();
                if (!isBottleActiveRef.current) {
                    setIsBottleActive(true);
                    setStatusText('Holding mug');
                }
            } else if (e.code === 'ArrowDown') {
                e.preventDefault();
                if (isBottleActiveRef.current && !isDrinkingRef.current) {
                    setIsDrinking(true);
                    drinkingStartTimeRef.current = Date.now();
                    setStatusText('Drinking! 💧');
                }
            } else if (e.code === 'Space') {
                e.preventDefault();
                if (isBottleActiveRef.current) {
                    setIsBottleActive(false);
                    setIsDrinking(false);
                    setStatusText('Mug down');
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'ArrowDown') {
                e.preventDefault();
                if (isDrinkingRef.current) {
                    setIsDrinking(false);
                    const drinkDuration = (Date.now() - drinkingStartTimeRef.current) / 1000;
                    const waterAdded = Math.round(drinkDuration * mlPerSecondRef.current);

                    setCurrentWater(prev => prev + waterAdded);
                    setTotalDailyWater(prev => prev + waterAdded);

                    if (isBottleActiveRef.current) {
                        setStatusText('Holding mug');
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Drinking interval animation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isDrinking) {
            interval = setInterval(() => {
                const now = Date.now();
                const stepDuration = (now - drinkingStartTimeRef.current) / 1000;
                if (stepDuration > 0.1) { // Update every ~100ms
                     const stepWater = Math.round(stepDuration * mlPerSecondRef.current);
                     if (stepWater > 0) {
                         setCurrentWater(prev => prev + stepWater);
                         setTotalDailyWater(prev => prev + stepWater);
                         drinkingStartTimeRef.current = now;
                     }
                }
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isDrinking]);

    // Derived values for display
    const percentage = Math.min((totalDailyWater / dailyGoal) * 100, 100);

    // Settings handlers
    const handleSaveSettings = (newGoal: number, newMlPerSecond: number) => {
        setDailyGoal(newGoal);
        setMlPerSecond(newMlPerSecond);
        setShowSettings(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>💧 Hydration Tracker</h1>
                <button className={styles.settingsBtn} onClick={() => setShowSettings(true)}>⚙️ Settings</button>
            </div>

            <div className={styles.mainContainer}>
                <div className={styles.bottleContainer}>
                    <Bottle
                        currentWater={currentWater}
                        dailyGoal={dailyGoal}
                        isBottleActive={isBottleActive}
                        statusText={statusText}
                    />
                </div>

                <div className={styles.infoContainer}>
                    <Stats dailyGoal={dailyGoal} totalDailyWater={totalDailyWater} />
                    <Reward percentage={percentage} />
                    <Instructions />
                </div>
            </div>

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                onSave={handleSaveSettings}
                currentGoal={dailyGoal}
                currentMlPerSecond={mlPerSecond}
            />
        </div>
    );
}
