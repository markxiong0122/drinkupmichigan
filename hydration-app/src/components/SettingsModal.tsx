import React from 'react';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newGoal: number, newMlPerSecond: number) => void;
    currentGoal: number;
    currentMlPerSecond: number;
}

export default function SettingsModal({ isOpen, onClose, onSave, currentGoal, currentMlPerSecond }: SettingsModalProps) {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const newGoal = parseInt((form.elements.namedItem('goalInput') as HTMLInputElement).value);
        const newMlPerSecond = parseInt((form.elements.namedItem('mlPerSecondInput') as HTMLInputElement).value);

        if (newGoal >= 500 && newGoal <= 10000 && newMlPerSecond >= 10 && newMlPerSecond <= 200) {
            onSave(newGoal, newMlPerSecond);
        }
    };

    return (
        <div className={`${styles.modal} ${styles.modalShow}`}>
            <div className={styles.modalContent}>
                <h2>Settings</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="goalInput">Daily Goal (mL):</label>
                        <input
                            type="number"
                            id="goalInput"
                            name="goalInput"
                            defaultValue={currentGoal}
                            min="500"
                            max="10000"
                            step="100"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="mlPerSecondInput">Water per second (mL):</label>
                        <input
                            type="number"
                            id="mlPerSecondInput"
                            name="mlPerSecondInput"
                            defaultValue={currentMlPerSecond}
                            min="10"
                            max="200"
                            step="10"
                        />
                    </div>
                    <div className={styles.btnGroup}>
                        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Save</button>
                        <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
