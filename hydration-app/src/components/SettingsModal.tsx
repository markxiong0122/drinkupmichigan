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

    useEffect(() => {
        setGoal(currentGoal);
        setMlPerSecond(currentMlPerSecond);
    }, [currentGoal, currentMlPerSecond, isOpen]);

    const handleSave = () => {
        if (goal >= 500 && goal <= 10000 && mlPerSecond >= 10 && mlPerSecond <= 200) {
            onSave(goal, mlPerSecond);
        }
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
                    />
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
                    />
                </div>
                <div className={styles.btnGroup}>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave}>Save</button>
                    <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
