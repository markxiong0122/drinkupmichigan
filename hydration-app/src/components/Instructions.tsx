import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Alert,
    AlertTitle,
} from '@mui/material';
import { KeyboardArrowUp as KeyboardArrowUpIcon, KeyboardArrowDown as KeyboardArrowDownIcon, Email as EmailIcon } from '@mui/icons-material';

export default function Instructions() {
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
                        <Chip icon={<EmailIcon />} label="↑↑ (Double-tap)" variant="outlined" color="primary" />
                        <Typography variant="body2">Tap twice quickly to <strong>send email to friend</strong></Typography>
                    </Box>
                </Box>
                <Alert severity="info" sx={{ mt: 3 }}>
                    <AlertTitle>New Mechanic</AlertTitle>
                    You must hold BOTH the cup (↑) AND drink button (↓) simultaneously to add water!
                </Alert>
            </CardContent>
        </Card>
    );
}

