import {
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
} from '@mui/material';
import { TrendingUp as TrendingUpIcon, Flag as FlagIcon } from '@mui/icons-material';

interface StatsProps {
    dailyGoal: number;
    totalDailyWater: number;
}

export default function Stats({ dailyGoal, totalDailyWater }: StatsProps) {
    const percentage = dailyGoal > 0 ? Math.min((totalDailyWater / dailyGoal) * 100, 100) : 0;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Daily Progress
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                            <FlagIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">Daily Goal</Typography>
                        </Box>
                        <Typography variant="h5" component="div" fontWeight="bold">
                            {dailyGoal} mL
                        </Typography>
                    </Box>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                            <TrendingUpIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">Consumed</Typography>
                        </Box>
                        <Typography variant="h5" component="div" fontWeight="bold" color="primary">
                            {totalDailyWater} mL
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress variant="determinate" value={percentage} sx={{ height: 10, borderRadius: 5 }} />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">{`${Math.round(
                            percentage
                        )}%`}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
