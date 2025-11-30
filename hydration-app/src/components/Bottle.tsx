import { Box, Typography } from '@mui/material';

interface BottleProps {
    currentWater: number;
    dailyGoal: number;
    isBottleActive: boolean;
    isDrinking?: boolean;
    statusText: string;
}

export default function Bottle({ currentWater, dailyGoal, isBottleActive, isDrinking }: BottleProps) {
    const percentage = dailyGoal > 0 ? Math.min((currentWater / dailyGoal) * 100, 100) : 0;

    return (
        <Box sx={{
            position: 'relative',
            width: 180,
            height: 450,
        }}>
            <Box sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                border: 3,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderRadius: '90px',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                ...(isBottleActive && {
                    borderColor: 'secondary.main',
                    boxShadow: '0 0 40px rgba(255, 152, 0, 0.4)',
                }),
                ...(isDrinking && {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 50px rgba(33, 150, 243, 0.6)',
                    animation: 'drinkPulse 0.8s ease-in-out infinite',
                }),
                '@keyframes drinkPulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
            }}>
                <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    background: (theme) => `linear-gradient(180deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
                    transition: 'height 0.2s ease',
                    height: `${percentage}%`,
                    ...(isDrinking && {
                        background: (theme) => `linear-gradient(180deg, ${theme.palette.success.light} 0%, ${theme.palette.success.dark} 100%)`,
                        animation: 'waterShimmer 1.5s ease infinite',
                    }),
                    '@keyframes waterShimmer': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.8 },
                    },
                }} />
                <Typography sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    color: 'white',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                    whiteSpace: 'nowrap',
                }}>
                    {currentWater} mL
                </Typography>
            </Box>
        </Box>
    );
}
