import { useState, useEffect } from 'react';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (goal: number, mlPerSecond: number, timerSeconds: number) => void;
    currentGoal: number;
    currentMlPerSecond: number;
    currentTimerSeconds: number;
}

export default function SettingsModal({ isOpen, onClose, onSave, currentGoal, currentMlPerSecond, currentTimerSeconds }: SettingsModalProps) {
    const [goal, setGoal] = useState(currentGoal);
    const [mlPerSecond, setMlPerSecond] = useState(currentMlPerSecond);
    const [timerSeconds, setTimerSeconds] = useState(currentTimerSeconds);
    const [errors, setErrors] = useState({ goal: '', mlPerSecond: '', timerSeconds: '' });

    useEffect(() => {
        setGoal(currentGoal);
        setMlPerSecond(currentMlPerSecond);
        setTimerSeconds(currentTimerSeconds);
        setErrors({ goal: '', mlPerSecond: '', timerSeconds: '' });
    }, [currentGoal, currentMlPerSecond, currentTimerSeconds, isOpen]);

    const handleSave = () => {
        const newErrors = { goal: '', mlPerSecond: '', timerSeconds: '' };

        if (isNaN(goal) || goal < 500 || goal > 10000) {
            newErrors.goal = 'Goal must be between 500 and 10000 mL';
        }

        if (isNaN(mlPerSecond) || mlPerSecond < 10 || mlPerSecond > 200) {
            newErrors.mlPerSecond = 'Water per second must be between 10 and 200 mL';
        }

        if (isNaN(timerSeconds) || timerSeconds < 5 || timerSeconds > 300) {
            newErrors.timerSeconds = 'Timer must be between 5 and 300 seconds';
        }

        if (newErrors.goal || newErrors.mlPerSecond || newErrors.timerSeconds) {
            setErrors(newErrors);
            return;
        }

        setErrors({ goal: '', mlPerSecond: '', timerSeconds: '' });
        onSave(goal, mlPerSecond, timerSeconds);
    };

    if (!isOpen) return null;

    return (
        <div className={`${styles.modal} ${isOpen ? styles.show : ''}`} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>⚙️ Settings</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="goalInput">Daily Goal (mL):</label>
                    <input
                        type="number"
                        id="goalInput"
                        min="500"
                        max="10000"
                        step="100"
                        value={goal}
                        onChange={(e) => setGoal(parseInt(e.target.value))}
                        className={errors.goal ? styles.inputError : ''}
                    />
                    {errors.goal && <div className={styles.errorText}>{errors.goal}</div>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="mlPerSecondInput">Water per second (mL):</label>
                    <input
                        type="number"
                        id="mlPerSecondInput"
                        min="10"
                        max="200"
                        step="10"
                        value={mlPerSecond}
                        onChange={(e) => setMlPerSecond(parseInt(e.target.value))}
                        className={errors.mlPerSecond ? styles.inputError : ''}
                    />
                    {errors.mlPerSecond && <div className={styles.errorText}>{errors.mlPerSecond}</div>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="timerSecondsInput">Reminder timer (seconds):</label>
                    <input
                        type="number"
                        id="timerSecondsInput"
                        min="5"
                        max="300"
                        step="5"
                        value={timerSeconds}
                        onChange={(e) => setTimerSeconds(parseInt(e.target.value))}
                        className={errors.timerSeconds ? styles.inputError : ''}
                    />
                    {errors.timerSeconds && <div className={styles.errorText}>{errors.timerSeconds}</div>}
                </div>
                <div className={styles.btnGroup}>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave}>Save</button>
                    <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
