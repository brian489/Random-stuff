import { Box, Button, Typography } from "@mui/material";
import { contentContainerStyle } from "../styles";
import React from "react";
import BackButton from "../components/BackButton";
import RefreshIcon from '@mui/icons-material/Refresh';

const boxStyle = {
    border: '2px solid white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '50px',
    lineHeight: 0,
}

const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    width: '300px',
    height: '300px',
}

function NaughtsAndCrosses() {
    const [value, setValue] = React.useState([null, null, null, null, null, null, null, null, null]);
    const [currentPlayer, setCurrentPlayer] = React.useState('X');
    const [ended, setEnd] = React.useState(false);

    const addValue = (index, val) => {
        if (value[index] === null) {
            const newValue = [...value];
            newValue[index] = val;
            setValue(newValue);
            return true;
        }
        return false;
    }

    const checkState = () => {
        if (value[0] === value[1] && value[1] === value[2] && value[0] !== null) {
            return value[0];
        }
        if (value[3] === value[4] && value[4] === value[5] && value[3] !== null) {
            return value[3];
        }
        if (value[6] === value[7] && value[7] === value[8] && value[6] !== null) {
            return value[6];
        }
        if (value[0] === value[3] && value[3] === value[6] && value[0] !== null) {
            return value[0];
        }
        if (value[1] === value[4] && value[4] === value[7] && value[1] !== null) {
            return value[1];
        }
        if (value[2] === value[5] && value[5] === value[8] && value[2] !== null) {
            return value[2];
        }
        if (value[0] === value[4] && value[4] === value[8] && value[0] !== null) {
            return value[0];
        }
        if (value[2] === value[4] && value[4] === value[6] && value[2] !== null) {
            return value[2];
        }
        for (let i = 0; i < value.length; i++) {
            if (value[i] === null) {
                return null;
            }
        }
        return 'draw';
    }

    const handleState = () => {
        const result = checkState();
        if (result === 'X') {
            setEnd(true);
        } else if (result === 'O') {
            setEnd(true);
        } else if (result === 'draw') {
            setEnd(true);
        };
    }

    const handleClick = (index) => {
        if (ended) return;
        if (addValue(index, currentPlayer))
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }

    const handleReset = () => {
        setValue([null, null, null, null, null, null, null, null, null]);
        setCurrentPlayer('X');
        setEnd(false);
    }

    React.useEffect(() => {
        handleState();
    }, [value]);

  return (
  <Box sx={contentContainerStyle}>
    <BackButton />
    <div>
      <h1>Naughts and Crosses</h1>
    </div>
    <Box sx={gridContainerStyle}>
      {Array.from({ length: 9 }, (_, index) => (
        <Box
            key={index}
          sx={boxStyle}
          onClick={() => { handleClick(index); }}
        >
            {value[index]}
        </Box>
      ))}
    </Box>
    <Typography variant="h4" sx={{ marginTop: '20px'}}>
        {ended ? (
            <span>
            {checkState() === 'draw' ? 'Draw!' : `${checkState()} wins!`}
            </span>
        ) : (
            <span>Next Player: {currentPlayer}</span>
        )}
    </Typography>
    <Button onClick={() => {handleReset()}} variant="outlined" color="error" sx={{mt: 5}} startIcon={<RefreshIcon />}>Reset</Button>
    </Box>
    )
};
export default NaughtsAndCrosses;