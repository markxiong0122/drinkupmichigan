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
    const [mlPerSecond, setMlPerSecond] = useState(150);
    const [totalDailyWater, setTotalDailyWater] = useState(0);
    const [allTimeWater, setAllTimeWater] = useState(0);
    const [isBottleHeld, setIsBottleHeld] = useState(false);
    const [isDrinkingPressed, setIsDrinkingPressed] = useState(false);
    const [statusText, setStatusText] = useState('Ready to drink');
    const [statusIcon, setStatusIcon] = useState('🥤');
    const [statusHint, setStatusHint] = useState('Hold cup + Press drink');
    const [showSettings, setShowSettings] = useState(false);
    const [lastDrinkTime, setLastDrinkTime] = useState<number | null>(null);

    // Refs for values accessed in event listeners/intervals
    const drinkingStartTimeRef = useRef<number>(0);
    const isBottleHeldRef = useRef(isBottleHeld);
    const isDrinkingPressedRef = useRef(isDrinkingPressed);
    const mlPerSecondRef = useRef(mlPerSecond);

    // Audio ref - placeholder for future audio file
    const reminderAudioRef = useRef<HTMLAudioElement | null>(null);

    // Sync refs with state
    useEffect(() => { isBottleHeldRef.current = isBottleHeld; }, [isBottleHeld]);
    useEffect(() => { isDrinkingPressedRef.current = isDrinkingPressed; }, [isDrinkingPressed]);
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
                setMlPerSecond(data.mlPerSecond || 150);
            } catch (e) {
                console.error("Failed to parse saved data", e);
            }
        }

        // Load all-time water
        const allTimeSaved = localStorage.getItem('allTimeWater');
        if (allTimeSaved) {
            setAllTimeWater(parseInt(allTimeSaved));
        } else {
            localStorage.setItem('allTimeWater', '0');
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

    // Initialize all-time water on first load
    useEffect(() => {
        const allTimeSaved = localStorage.getItem('allTimeWater');
        if (!allTimeSaved) {
            localStorage.setItem('allTimeWater', '0');
        }
    }, []);


    // Check for goal completion
    useEffect(() => {
        if (currentWater >= dailyGoal && dailyGoal > 0) {
            const timer = setTimeout(() => {
                setCurrentWater(0);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentWater, dailyGoal]);

    // Initialize audio and check inactivity timer
    useEffect(() => {
        // Initialize audio element with imported sound file
        reminderAudioRef.current = new Audio('/sounds/reminder1.mp3');

        // Check every second if we need to play the reminder
        const checkInterval = setInterval(() => {
            if (lastDrinkTime !== null) {
                const timeSinceLastDrink = Date.now() - lastDrinkTime;
                const tenSecondsInMs = 10 * 1000; // 10 seconds
                console.log(`⏱️ Timer check: ${(timeSinceLastDrink / 1000).toFixed(1)}s since last drink`);

                if (timeSinceLastDrink >= tenSecondsInMs) {
                    // Play reminder sound continuously (don't reset timer)
                    console.log('🔔 Reminder: Time to drink water! (10 seconds passed - playing sound)');
                    reminderAudioRef.current?.play().catch(err => {
                        console.error('Failed to play reminder sound:', err);
                    });
                    // Don't reset timer - keep playing until keyboard input
                }
            } else {
                console.log('⏱️ Timer check: No active timer (lastDrinkTime is null)');
            }
        }, 1000); // Check every second

        return () => clearInterval(checkInterval);
    }, [lastDrinkTime]);

    // Update status display
    const updateStatus = (held: boolean, pressed: boolean) => {
        const isDrinking = held && pressed;

        if (isDrinking) {
            setStatusIcon('💧');
            setStatusText('Drinking!');
            setStatusHint('Keep both buttons pressed');
        } else if (held && !pressed) {
            setStatusIcon('✋');
            setStatusText('Holding cup');
            setStatusHint('Now press drink button');
        } else if (!held && pressed) {
            setStatusIcon('⚠️');
            setStatusText('Hold cup first!');
            setStatusHint('Press up arrow to hold cup');
        } else {
            setStatusIcon('🥤');
            setStatusText('Ready to drink');
            setStatusHint('Hold cup + Press drink');
        }
    };

    // Update drinking state based on both keys
    const updateDrinkingState = (held: boolean, pressed: boolean) => {
        const shouldBeDrinking = held && pressed;

        if (shouldBeDrinking && drinkingStartTimeRef.current === 0) {
            // Start drinking
            drinkingStartTimeRef.current = Date.now();
        } else if (!shouldBeDrinking && drinkingStartTimeRef.current > 0) {
            // Stop drinking
            const drinkDuration = (Date.now() - drinkingStartTimeRef.current) / 1000;
            const waterAdded = Math.round(drinkDuration * mlPerSecondRef.current);

            if (waterAdded > 0) {
                setCurrentWater(prev => prev + waterAdded);
                setTotalDailyWater(prev => prev + waterAdded);

                // Update all-time water
                setAllTimeWater(prev => {
                    const newValue = prev + waterAdded;
                    localStorage.setItem('allTimeWater', newValue.toString());
                    return newValue;
                });
            }

            drinkingStartTimeRef.current = 0;
        }
    };

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown'].includes(e.code)) {
                e.preventDefault();
            }

            if (e.code === 'ArrowUp') {
                setIsBottleHeld(true);
                updateStatus(true, isDrinkingPressedRef.current);
                updateDrinkingState(true, isDrinkingPressedRef.current);

                // Reset timer only if BOTH keys are now pressed (drinking)
                if (isDrinkingPressedRef.current) {
                    const now = Date.now();
                    console.log('🟢 Timer RESET (both keys pressed): lastDrinkTime set to', new Date(now).toLocaleTimeString());
                    setLastDrinkTime(now);

                    // Stop audio immediately if playing
                    if (reminderAudioRef.current) {
                        reminderAudioRef.current.pause();
                        reminderAudioRef.current.currentTime = 0;
                        console.log('🔇 Audio stopped');
                    }
                }
            } else if (e.code === 'ArrowDown') {
                setIsDrinkingPressed(true);
                updateStatus(isBottleHeldRef.current, true);
                updateDrinkingState(isBottleHeldRef.current, true);

                // Reset timer only if BOTH keys are now pressed (drinking)
                if (isBottleHeldRef.current) {
                    const now = Date.now();
                    console.log('🟢 Timer RESET (both keys pressed): lastDrinkTime set to', new Date(now).toLocaleTimeString());
                    setLastDrinkTime(now);

                    // Stop audio immediately if playing
                    if (reminderAudioRef.current) {
                        reminderAudioRef.current.pause();
                        reminderAudioRef.current.currentTime = 0;
                        console.log('🔇 Audio stopped');
                    }
                }
            } else if (e.code === 'Space') {
                // Reset everything
                const held = isBottleHeldRef.current;
                const pressed = isDrinkingPressedRef.current;

                if (drinkingStartTimeRef.current > 0) {
                    const drinkDuration = (Date.now() - drinkingStartTimeRef.current) / 1000;
                    const waterAdded = Math.round(drinkDuration * mlPerSecondRef.current);

                    if (waterAdded > 0) {
                        setCurrentWater(prev => prev + waterAdded);
                        setTotalDailyWater(prev => prev + waterAdded);

                        const allTimeSaved = localStorage.getItem('allTimeWater');
                        let allTimeTotal = allTimeSaved ? parseInt(allTimeSaved) : 0;
                        allTimeTotal += waterAdded;
                        localStorage.setItem('allTimeWater', allTimeTotal.toString());
                    }
                }

                setIsBottleHeld(false);
                setIsDrinkingPressed(false);
                drinkingStartTimeRef.current = 0;
                updateStatus(false, false);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown'].includes(e.code)) {
                e.preventDefault();
            }

            if (e.code === 'ArrowUp') {
                setIsBottleHeld(false);
                updateStatus(false, isDrinkingPressedRef.current);
                updateDrinkingState(false, isDrinkingPressedRef.current);
            } else if (e.code === 'ArrowDown') {
                setIsDrinkingPressed(false);
                updateStatus(isBottleHeldRef.current, false);
                updateDrinkingState(isBottleHeldRef.current, false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Update display while drinking (for animation)
    useEffect(() => {
        let interval: NodeJS.Timeout;
        const isDrinking = isBottleHeld && isDrinkingPressed;

        if (isDrinking && drinkingStartTimeRef.current > 0) {
            interval = setInterval(() => {
                const now = Date.now();
                const stepDuration = (now - drinkingStartTimeRef.current) / 1000;
                if (stepDuration > 0.1) {
                    const stepWater = Math.round(stepDuration * mlPerSecondRef.current);
                    if (stepWater > 0) {
                        setCurrentWater(prev => prev + stepWater);
                        setTotalDailyWater(prev => prev + stepWater);

                        setAllTimeWater(prev => {
                            const newValue = prev + stepWater;
                            localStorage.setItem('allTimeWater', newValue.toString());
                            return newValue;
                        });

                        drinkingStartTimeRef.current = now;
                    }
                }
            }, 100);
        }

        return () => clearInterval(interval);
    }, [isBottleHeld, isDrinkingPressed]);

    // Derived values for display
    const percentage = Math.min((totalDailyWater / dailyGoal) * 100, 100);
    const isDrinking = isBottleHeld && isDrinkingPressed;

    // Settings handlers
    const handleSaveSettings = (newGoal: number, newMlPerSecond: number) => {
        setDailyGoal(newGoal);
        setMlPerSecond(newMlPerSecond);
        setShowSettings(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>💧</div>
                    <h1>HydroTrack</h1>
                </div>
                <div className={styles.headerButtons}>
                    <button className={styles.settingsBtn} onClick={() => setShowSettings(true)}>⚙️ Settings</button>
                </div>
            </div>

            <div className={styles.mainContainer}>
                <div className={styles.infoContainer}>
                    <Stats dailyGoal={dailyGoal} totalDailyWater={totalDailyWater} />
                    <Reward
                        percentage={percentage}
                        totalDailyWater={totalDailyWater}
                        dailyGoal={dailyGoal}
                        allTimeWater={allTimeWater}
                    />
                </div>

                <div className={styles.bottleContainer}>
                    <Bottle
                        currentWater={currentWater}
                        dailyGoal={dailyGoal}
                        isBottleActive={isBottleHeld}
                        isDrinking={isDrinking}
                        statusText={statusText}
                    />
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        minWidth: '200px'
                    }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{statusIcon}</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e0e6ed' }}>{statusText}</div>
                        <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '8px' }}>{statusHint}</div>
                    </div>
                </div>

                <div className={styles.infoContainer}>
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
