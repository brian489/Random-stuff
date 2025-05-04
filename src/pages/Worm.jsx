import { Box, Button, Typography } from "@mui/material";
import { contentContainerStyle } from "../styles";
import React from "react";
import BackButton from "../components/BackButton";
const rows = 10;
const cols = 10;
const generateBoard = (rows, cols) => {
    const b = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            b.push({ x: j, y: i, val: gridItemStyle });
        }
    }
    return b;
}

const GridContainerStyle = {
  width: '55%',
  height: '60%',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
}

const gridItemStyle = {
  boxSizing: 'border-box',
  border: '1px solid white',
  width: `calc(100% / ${cols})`,
  height: `calc(100% / ${rows})`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '50px',
  lineHeight: 0,
}

const wormStyle = {
  backgroundColor: 'green',
  ...gridItemStyle
}

const foodStyle = {
  backgroundColor: 'red',
  ...gridItemStyle
}

const checkValidMove = (head, board) => {
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        return false;
    }
    for (let i = 0; i < board.length; i++) {
        if (board[i].x === head.x && board[i].y === head.y) {
            if (board[i].val === wormStyle) {
                return false;
            }
        }
    }
    return true;
}
const foodCollision = (head, food) => {
    if (head.x === food.x && head.y === food.y) {
        return true;
    }
    return false;
}

const getRandomFood = (board) => {
  const emptyCells = board.filter(cell => cell.val === gridItemStyle);
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];
  
  return {x: randomCell.x, y: randomCell.y};
}
const defBoard = generateBoard(rows, cols);
function Worm() {
  const [food, setFood] = React.useState({ x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) });
  const [worm, setWorm] = React.useState([{ x: 0, y: 0 }]);
  const [board, setBoard] = React.useState(defBoard);
  const [score, setScore] = React.useState(0);
  const [gameOn, setGameOn] = React.useState(false);
  const [gameEnded, setGameEnded] = React.useState(false);
  const [direction, setDirection] = React.useState('RIGHT');

    const handleStart = () => {
      setDirection('RIGHT');
      setScore(0);
      setWorm([{ x: 0, y: 0 }]);
      const newBoard = generateBoard(rows, cols);
      const randomFood = getRandomFood(newBoard);
      setFood(randomFood);
      newBoard[randomFood.y * rows + randomFood.x].val = foodStyle;
      newBoard[worm[0].y * rows + worm[0].x].val = wormStyle;
      console.log(newBoard);
      setBoard([...newBoard]);
      setGameOn(true);
    }

  const handleFrame = () => {
    if (!gameOn) return;
    const head = worm[0];
    let newHead;
    if (direction === 'UP') {
      newHead = { x: head.x , y: head.y - 1};
    } else if (direction === 'DOWN') {
      newHead = { x: head.x, y: head.y + 1 };
    } else if (direction === 'LEFT') {
      newHead = { x: head.x - 1, y: head.y };
    } else if (direction === 'RIGHT') {
      newHead = { x: head.x + 1, y: head.y };
    }
    if (checkValidMove(newHead, board)) {

      if (foodCollision(newHead, food)) {
        setScore(score + 1);
        if (score === rows * cols - 1) {
          setGameOn(false);
          alert('You win! Your score: ' + score);
          return;
        }
        const randomFood = getRandomFood(board);
        setFood(randomFood);
        board[randomFood.y * rows + randomFood.x].val = foodStyle;

      } else {
        // remove the tail
        const tail = worm.pop();
        board[tail.y * rows + tail.x].val = gridItemStyle;
      }
      worm.unshift(newHead);
      board[newHead.y * rows + newHead.x].val = wormStyle;
      setBoard([...board]);
      setWorm([...worm]);

    } else {
      // Game Over
      setGameOn(false);
      setGameEnded(true);
    }

  }

  const handleKeyPress = (event) => {
    const key = event.key;
    if (key === 'ArrowUp' && direction !== 'DOWN') {
      setDirection('UP');
    } else if (key === 'ArrowDown' && direction !== 'UP') {
      setDirection('DOWN');
    } else if (key === 'ArrowLeft' && direction !== 'RIGHT') {
      setDirection('LEFT');
    } else if (key === 'ArrowRight' && direction !== 'LEFT') {
      setDirection('RIGHT');
    }
  }

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    const interval = setInterval(() => {
      handleFrame();
    }, 100);
    return () =>  {
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyPress);
    }
  }, [board, gameOn]);


  return (
    <Box sx={{...contentContainerStyle}}>
      <BackButton />
      <Typography variant="h4" color="white" fontWeight={600} >
        Worm Game
      </Typography>
      {gameEnded && (
        <Typography variant="p" color="red" >
          Game Over! Your score: {score}
        </Typography>
      )}
      {(gameOn) ? (
        <Typography variant="p" color="white" >
          Your score: {score}
        </Typography>
      ) : (
        (!gameEnded) && (
        <Typography variant="p" color="white" >
          Start the game below! Use arrow keys to control the worm.
        </Typography>)
      )}
      <Box sx={GridContainerStyle}>
      {board.map((cell) => {return (
        <Box sx={cell.val} key={cell.x + cell.y * rows} >
        </Box>
      )})}
      </Box>
      {(!gameOn && !gameEnded && <Button variant="outlined" color="success"  onClick={handleStart}>Start Game</Button>)}
      {(gameEnded && <Button variant="outlined" color="error" onClick={() => {window.location.reload()}}>Reset</Button>)}
      {gameOn && !gameEnded && (
        <Typography variant="p" color="white" >
          Use arrow keys to control the worm.
        </Typography>
      )}
      
    </Box>
  );
}

export default Worm;