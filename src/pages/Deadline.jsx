import { Box, Button, Typography } from "@mui/material";
import { contentContainerStyle } from "../styles";
import React from "react";
import BackButton from "../components/BackButton";
import RefreshIcon from '@mui/icons-material/Refresh';

const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

function Deadline() {
    const targetDate = new Date('2027-02-24T00:00:00');
    const [countdown, setCountdown] = React.useState(targetDate - new Date());

    React.useEffect(() => {
        const interval = setInterval(() => {
            const difference = targetDate - new Date();
            console.log(difference);
            setCountdown(difference > 0 ? difference : 0);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={contentContainerStyle}>
            <BackButton />
            <Typography variant="h3" gutterBottom>
                Countdown to the deadline:
            </Typography>
            <Typography variant="h4">
                {formatTime(countdown)}
            </Typography>
        </Box>
    );
}
export default Deadline;