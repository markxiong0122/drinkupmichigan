import { useState, useEffect } from 'react';
import {
    Modal,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
} from '@mui/material';

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

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="settings-modal-title"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Card sx={{ minWidth: 400, maxWidth: '90vw' }}>
                <CardContent>
                    <Typography id="settings-modal-title" variant="h5" component="h2" gutterBottom>
                        Settings
                    </Typography>
                    <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
                        <TextField
                            label="Daily Goal (mL)"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={goal}
                            onChange={(e) => setGoal(parseInt(e.target.value))}
                            error={!!errors.goal}
                            helperText={errors.goal}
                            inputProps={{ min: 500, max: 10000, step: 100 }}
                        />
                        <TextField
                            label="Water per second (mL)"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={mlPerSecond}
                            onChange={(e) => setMlPerSecond(parseInt(e.target.value))}
                            error={!!errors.mlPerSecond}
                            helperText={errors.mlPerSecond}
                            inputProps={{ min: 10, max: 200, step: 10 }}
                        />
                        <TextField
                            label="Reminder timer (seconds)"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={timerSeconds}
                            onChange={(e) => setTimerSeconds(parseInt(e.target.value))}
                            error={!!errors.timerSeconds}
                            helperText={errors.timerSeconds}
                            inputProps={{ min: 5, max: 300, step: 5 }}
                        />
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button variant="contained" onClick={handleSave}>Save</Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Modal>
    );
}
