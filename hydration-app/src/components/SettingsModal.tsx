import { useState, useEffect } from 'react';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (goal: number, mlPerSecond: number) => void;
    currentGoal: number;
    currentMlPerSecond: number;
}

export default function SettingsModal({ isOpen, onClose, onSave, currentGoal, currentMlPerSecond }: SettingsModalProps) {
    const [goal, setGoal] = useState(currentGoal);
    const [mlPerSecond, setMlPerSecond] = useState(currentMlPerSecond);
    const [errors, setErrors] = useState({ goal: '', mlPerSecond: '' });

    useEffect(() => {
        setGoal(currentGoal);
        setMlPerSecond(currentMlPerSecond);
        setErrors({ goal: '', mlPerSecond: '' });
    }, [currentGoal, currentMlPerSecond, isOpen]);

    const handleSave = () => {
        const newErrors = { goal: '', mlPerSecond: '' };

        if (isNaN(goal) || goal < 500 || goal > 10000) {
            newErrors.goal = 'Goal must be between 500 and 10000 mL';
        }

        if (isNaN(mlPerSecond) || mlPerSecond < 10 || mlPerSecond > 200) {
            newErrors.mlPerSecond = 'Water per second must be between 10 and 200 mL';
        }

        if (newErrors.goal || newErrors.mlPerSecond) {
            setErrors(newErrors);
            return;
        }

        setErrors({ goal: '', mlPerSecond: '' });
        onSave(goal, mlPerSecond);
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
                <div className={styles.btnGroup}>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave}>Save</button>
                    <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
