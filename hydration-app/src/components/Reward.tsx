import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    LinearProgress,
} from '@mui/material';
import { EmojiEvents as EmojiEventsIcon, Waves as WavesIcon } from '@mui/icons-material';

interface RewardProps {
    percentage: number;
    totalDailyWater: number;
    dailyGoal: number;
    allTimeWater: number;
}

const LAKE_MICHIGAN_VOLUME_ML = 4920000000000000;

const rewards = [
    { threshold: 0, emoji: '🐟', name: 'Fish Tank', description: 'Starting your journey!' },
    { threshold: 33, emoji: '🏊', name: 'Swimming Pool', description: 'Making great progress!' },
    { threshold: 66, emoji: '🏖️', name: 'Bay', description: 'You\'re almost there!' },
    { threshold: 100, emoji: '🌊', name: 'Ocean', description: 'Daily goal achieved!' }
];

export default function Reward({ percentage, totalDailyWater, dailyGoal, allTimeWater }: RewardProps) {
    const lakeMichiganPercentage = (allTimeWater / LAKE_MICHIGAN_VOLUME_ML) * 100;
    const lakeMichiganLiters = allTimeWater / 1000;

    let currentReward = rewards[0];
    for (const reward of rewards) {
        if (percentage >= reward.threshold) {
            currentReward = reward;
        }
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        <EmojiEventsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Current Status
                    </Typography>
                    <Box sx={{ textAlign: 'center', my: 3 }}>
                        <Typography variant="h2">{currentReward.emoji}</Typography>
                        <Typography variant="h5" component="div" fontWeight="bold">
                            {currentReward.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {currentReward.description}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress variant="determinate" value={percentage} sx={{ height: 10, borderRadius: 5 }} />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">{`${Math.round(percentage)}%`}</Typography>
                        </Box>
                    </Box>
                     <Typography variant="body2" color="text.secondary" align="center">
                        {totalDailyWater} / {dailyGoal} mL
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mt: 2 }}>
                        {rewards.map((reward, index) => (
                            <Chip
                                key={index}
                                icon={<Typography variant="h6">{reward.emoji}</Typography>}
                                label={`${reward.threshold}%`}
                                variant={percentage >= reward.threshold ? 'filled' : 'outlined'}
                                color={percentage >= reward.threshold ? 'success' : 'default'}
                                sx={{ width: '100%' }}
                            />
                        ))}
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        <WavesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Lake Michigan Goal
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, textAlign: 'center' }}>
                        <Box>
                            <Typography variant="h5" component="div" fontWeight="bold">
                                {lakeMichiganLiters.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Liters Total
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h5" component="div" fontWeight="bold">
                                {lakeMichiganPercentage.toExponential(2)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                of Lake
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary" align="center" component="p" sx={{ mt: 2 }}>
                        Contributing to draining 4,920 km³ of water!
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
}
