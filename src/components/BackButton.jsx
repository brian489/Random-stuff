import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { IconButton } from '@mui/material';

const iconStyle = {
  color: 'white',
  fontSize: '2rem',
  margin: '10px',
  '&:hover': {
    color: '#f50057',
  },
};

const BackButtonStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
};

const BackButton = () => {
    return (
        <>
    <IconButton sx={BackButtonStyle} onClick={() => window.history.back()}>
        <ArrowBackIosNewIcon sx={iconStyle} />
    </IconButton>
    </>
    )
};
export default BackButton;