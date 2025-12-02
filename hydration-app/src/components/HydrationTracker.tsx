'use client';

import emailjs from '@emailjs/browser';
import { Settings as SettingsIcon, WaterDrop as WaterDropIcon } from '@mui/icons-material';
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Toolbar,
    Typography,
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import Bottle from './Bottle';
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
    timerSeconds: number;
}

export default function HydrationTracker() {
    // State
    const [currentWater, setCurrentWater] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(3000);
    const [mlPerSecond, setMlPerSecond] = useState(150);
    const [timerSeconds, setTimerSeconds] = useState(10);
    const [totalDailyWater, setTotalDailyWater] = useState(0);
    const [allTimeWater, setAllTimeWater] = useState(0);
    const [isBottleHeld, setIsBottleHeld] = useState(false);
    const [isDrinkingPressed, setIsDrinkingPressed] = useState(false);
    const [statusText, setStatusText] = useState('Ready to drink');
    const [statusIcon, setStatusIcon] = useState('🥤');
    const [statusHint, setStatusHint] = useState('Hold cup + Press drink');
    const [showSettings, setShowSettings] = useState(false);
    const [lastDrinkTime, setLastDrinkTime] = useState<number | null>(null);
    const [lastRightArrowTime, setLastRightArrowTime] = useState<number>(0);
    const [emailStatus, setEmailStatus] = useState<string>('');

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
                setTimerSeconds(data.timerSeconds || 10);
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
            mlPerSecond,
            timerSeconds
        };
        localStorage.setItem('hydrationData', JSON.stringify(data));
    }, [totalDailyWater, currentWater, dailyGoal, mlPerSecond, timerSeconds]);

    // Initialize all-time water on first load
    useEffect(() => {
        const allTimeSaved = localStorage.getItem('allTimeWater');
        if (!allTimeSaved) {
            localStorage.setItem('allTimeWater', '0');
        }
    }, []);

    // Initialize EmailJS
    useEffect(() => {
        emailjs.init('jOFLhf2RZu0onj_Zt');
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
                const timerThresholdMs = timerSeconds * 1000;
                console.log(`⏱️ Timer check: ${(timeSinceLastDrink / 1000).toFixed(1)}s since last drink (threshold: ${timerSeconds}s)`);

                if (timeSinceLastDrink >= timerThresholdMs) {
                    // Play reminder sound continuously (don't reset timer)
                    console.log(`🔔 Reminder: Time to drink water! (${timerSeconds} seconds passed - playing sound)`);
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
    }, [lastDrinkTime, timerSeconds]);

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

    // Send email function
    const sendEmail = useCallback(async () => {
        try {
            setEmailStatus('📧 Sending emails...');

            // List of recipients - add more email addresses here
            const recipients = [
                'zhizhongs@uchicago.edu',
                'ruotian2003@uchicago.edu',
                'markxiong0122@gmail.com'
            ];

            // Send email to each recipient
            const emailPromises = recipients.map(async (recipient) => {
                const templateParams = {
                    to_email: recipient,
                    subject: 'Hydration Reminder',
                    message: `Time to drink water! I've consumed ${totalDailyWater}ml today out of my ${dailyGoal}ml goal.`,
                    from_name: 'HydroTrack App'
                };

                // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS service and template IDs
                return emailjs.send('service_nu9dh4u', 'template_km55v7j', templateParams);
            });

            // Wait for all emails to be sent
            const results = await Promise.allSettled(emailPromises);

            // Check results
            const successful = results.filter(result => result.status === 'fulfilled').length;
            const failed = results.filter(result => result.status === 'rejected').length;

            if (failed === 0) {
                console.log(`All ${successful} emails sent successfully`);
                setEmailStatus(`✅ Sent to ${successful} recipient${successful > 1 ? 's' : ''}!`);
            } else if (successful > 0) {
                console.log(`${successful} emails sent successfully, ${failed} failed`);
                setEmailStatus(`⚠️ Sent to ${successful}, ${failed} failed`);
            } else {
                throw new Error('All emails failed to send');
            }

            // Clear status after 4 seconds
            setTimeout(() => setEmailStatus(''), 4000);
        } catch (error) {
            console.error('Failed to send emails:', error);
            setEmailStatus('❌ Failed to send emails');

            // Clear error status after 5 seconds
            setTimeout(() => setEmailStatus(''), 5000);
        }
    }, [totalDailyWater, dailyGoal]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown'].includes(e.code)) {
                e.preventDefault();
            }

            if (e.code === 'ArrowUp') {
                const now = Date.now();
                setIsBottleHeld(true);
                updateStatus(true, isDrinkingPressedRef.current);
                updateDrinkingState(true, isDrinkingPressedRef.current);

                // Reset timer only if BOTH keys are now pressed (drinking)
                if (isDrinkingPressedRef.current) {
                    console.log('🟢 Timer RESET (both keys pressed): lastDrinkTime set to', new Date(now).toLocaleTimeString());
                    setLastDrinkTime(now);

                    // Stop audio immediately if playing
                    if (reminderAudioRef.current) {
                        reminderAudioRef.current.pause();
                        reminderAudioRef.current.currentTime = 0;
                        console.log('🔇 Audio stopped');
                    }
                }
            } else if (e.code === 'ArrowRight') {
                const now = Date.now();
                const timeSinceLastRight = now - lastRightArrowTime;

                // Check for double-tap (within 300ms)
                if (timeSinceLastRight < 300) {
                    console.log('📧 Double-tap detected! Sending email...');
                    sendEmail();
                }

                setLastRightArrowTime(now);
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
    }, [sendEmail, lastRightArrowTime]);

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
    const handleSaveSettings = (newGoal: number, newMlPerSecond: number, newTimerSeconds: number) => {
        setDailyGoal(newGoal);
        setMlPerSecond(newMlPerSecond);
        setTimerSeconds(newTimerSeconds);
        setShowSettings(false);
    };

    // Reset handler
    const handleReset = () => {
        // Reset all state
        setCurrentWater(0);
        setTotalDailyWater(0);
        setAllTimeWater(0);
        setIsBottleHeld(false);
        setIsDrinkingPressed(false);
        setLastDrinkTime(null);
        setStatusText('Ready to drink');
        setStatusIcon('🥤');
        setStatusHint('Hold cup + Press drink');
        drinkingStartTimeRef.current = 0;

        // Clear localStorage
        localStorage.setItem('allTimeWater', '0');
        const data: HydrationData = {
            date: new Date().toDateString(),
            totalDailyWater: 0,
            currentWater: 0,
            dailyGoal,
            mlPerSecond,
            timerSeconds
        };
        localStorage.setItem('hydrationData', JSON.stringify(data));

        console.log('🔄 All progress has been reset');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Toolbar>
                    <WaterDropIcon color="primary" sx={{ mr: 1.5, fontSize: '2rem' }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
                        HydroTrack
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<SettingsIcon />}
                        onClick={() => setShowSettings(true)}
                    >
                        Settings
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: '1fr 1fr 1fr',
                        },
                        gap: 4,
                    }}
                >
                    <Box>
                        <Stats dailyGoal={dailyGoal} totalDailyWater={totalDailyWater} />
                        <Box sx={{ mt: 4 }}>
                            <Reward
                                percentage={percentage}
                                totalDailyWater={totalDailyWater}
                                dailyGoal={dailyGoal}
                                allTimeWater={allTimeWater}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <Bottle
                            currentWater={currentWater}
                            dailyGoal={dailyGoal}
                            isBottleActive={isBottleHeld}
                            isDrinking={isDrinking}
                            statusText={statusText}
                        />
                        <Card sx={{ minWidth: 240, textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h2" sx={{ mb: 1 }}>{statusIcon}</Typography>
                                <Typography variant="h6" color="text.primary">{statusText}</Typography>
                                <Typography variant="body2" color="text.secondary">{statusHint}</Typography>
                                {emailStatus && (
                                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                                        {emailStatus}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Box>

                    <Box>
                        <Instructions onReset={handleReset} />
                    </Box>
                </Box>
            </Container>

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                onSave={handleSaveSettings}
                currentGoal={dailyGoal}
                currentMlPerSecond={mlPerSecond}
                currentTimerSeconds={timerSeconds}
            />
        </Box>
    );
}
