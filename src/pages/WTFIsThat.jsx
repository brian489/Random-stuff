import { Box, Input, Typography } from "@mui/material";
import { contentContainerStyle } from "../styles";
import BackButton from "../components/BackButton";
import React from "react";
import { generateGame } from "../helpers/NameTheImage";
import { Image } from "@mui/icons-material";

const randomCheck = (probabilty) => {
    const randomNum = Math.random();
    return randomNum < probabilty;
}

const parseHint = (hint) => {
    let parsedHint = "";
    for (let i = 0; i < hint.length; i++) {
        if (hint[i] === " ") {
            parsedHint += "\xa0\xa0\xa0";
        } else if (hint[i] === "_") {
            parsedHint += ' ' + hint[i] + ' ';
        } else {
            parsedHint += hint[i];
        }
    }
    return parsedHint;
}

function WTFIsThat() {

    const [image, setImage] = React.useState(null);
    const [solution, setSolution] = React.useState(null);
    const [hint, setHint] = React.useState("");

    const handleNewImage = () => {
        console.log("New image");
        const val = generateGame();
        setHint("");
        setImage(val.img);
        setSolution(val.ans);
        HandleHint(val.ans, "");
    }

    const HandleHint = (solution, curHint) => {
        let newHint = "";
        const currentHint = curHint;
        if (currentHint === "") {
            for (let i = 0; i < solution.length; i++) {
                if (solution[i] === " ")
                    newHint += " ";
                else
                    newHint += "_";
            }
        } else {
            //get index of  all _ in currentHint
            const indexes = [];
            for (let i = 0; i < currentHint.length; i++) {
                if (currentHint[i] === "_") {
                    indexes.push(i);
                }
            }

            for (let i = 0; i < currentHint.length; i++) {
                if (currentHint[i] === "_" && randomCheck(0.2)) {
                    newHint += solution[i];
                } else {
                    newHint += currentHint[i];
                }
            }
        }
        setHint(newHint);
    }

    const handleGuess = (guess) => {
        if (guess.toLowerCase().replace(/ /g,'') === solution.toLowerCase().replace(/ /g,'')) {
            alert("Correct!");
            handleNewImage();
        } else {
            HandleHint(solution, hint);
        }

    }

    React.useEffect(() => {
        handleNewImage();
    }
    , []);

  return (
    <Box sx={contentContainerStyle}>
        <BackButton />
        <h1>WTF is that?</h1>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="h5" sx={{color: 'white', mb: 2}}>
                {parseHint(hint)}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <img style={{height: '300px'}} src={image} alt="Image of something idk" />
            </Box>
        </Box>
        <form onSubmit={(e) => {
            e.preventDefault();
            handleGuess(e.target[0].value);
            e.target.reset();
        }
        }>
            <label>
                <Input type="text" placeholder="Enter your guess" sx={{color:'white', mr: 3}}/>
            </label>
            <button type="submit">Submit</button>
        </form>

    </Box>
  );
}

export default WTFIsThat;