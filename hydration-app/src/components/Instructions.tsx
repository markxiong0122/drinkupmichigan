import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Alert,
    AlertTitle,
    Button,
} from '@mui/material';
import { KeyboardArrowUp as KeyboardArrowUpIcon, KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowRight as KeyboardArrowRightIcon, RestartAlt as RestartAltIcon } from '@mui/icons-material';

interface InstructionsProps {
    onReset: () => void;
}

export default function Instructions({ onReset }: InstructionsProps) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Controls
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip icon={<KeyboardArrowUpIcon />} label="Up Arrow" variant="outlined" />
                        <Typography variant="body2">Hold to <strong>pick up cup</strong></Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip icon={<KeyboardArrowDownIcon />} label="Down Arrow" variant="outlined" />
                        <Typography variant="body2">Hold to <strong>drink water</strong></Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip icon={<KeyboardArrowRightIcon />} label="→→ (Double-tap)" variant="outlined" color="primary" />
                        <Typography variant="body2">Tap Right Arrow twice quickly to <strong>send email to friend</strong></Typography>
                    </Box>
                </Box>
                <Alert severity="info" sx={{ mt: 3 }}>
                    <AlertTitle>New Mechanic</AlertTitle>
                    You must hold BOTH the cup (↑) AND drink button (↓) simultaneously to add water!
                </Alert>
                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<RestartAltIcon />}
                    onClick={onReset}
                    sx={{ mt: 2 }}
                >
                    Reset All Progress
                </Button>
            </CardContent>
        </Card>
    );
}

