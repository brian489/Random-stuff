import { Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { contentContainerStyle } from "../styles";


function Dasboard() {
    const navigate = useNavigate();
    return (
        <Box style={contentContainerStyle}>
            <h1>Dasboard</h1>
            <p>Welcome to the Dasboard page!</p>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                <Link to='/p1'>Page1</Link>
                <Link to='/p2'>Page2</Link>
                <Link to='/p3'>Page3</Link>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                <Link to='/game1'>X & 0</Link>
                <Link to='/game2'>Worm</Link>
                <Link to='/game3'>WTF is that</Link>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                <Link to='/Image-Converter'>Image to URL</Link>
            </Box>
        </Box>
    );
}

export default Dasboard;