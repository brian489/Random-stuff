import { Box, Button, Icon, IconButton, Input, styled, Typography } from "@mui/material";
import { contentContainerStyle } from "../styles";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BackButton from "../components/BackButton";
import React from "react";
import { fileToDataUrl } from "../helpers/imageToURI";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

function ImageToUrl() {
    const [dataUrls, setDataUrls] = React.useState([]);

    const handleFile = (files) => {
        const urls = [];
        for (let i = 0; i < files.length; i++) {
            fileToDataUrl(files[i])
                .then((dataUrl) => {
                    urls.push(dataUrl);
                    if (urls.length === files.length) {
                        setDataUrls(urls);
                    }
                })
                .catch((error) => {
                    console.error("Error converting file to data URL:", error);
                });
        }
    }

    React.useEffect(() => {}, [dataUrls]);

  return (
    <Box sx={contentContainerStyle}>
        <BackButton />
        <h1>PNG Converter</h1>
        <p>Converts images to Data Urls</p>
        <Box>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                >
                Upload files
                <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => {handleFile(event.target.files)}}
                    multiple
                />
            </Button>
            {dataUrls.length > 0 &&
            <IconButton sx={{color: 'white' , ml: 3}}onClick={() => {
                navigator.clipboard.writeText(dataUrls[0]);
            }}>
                <ContentCopyIcon />
            </IconButton>
            }
        </Box>
       
    </Box>
  );
}

export default ImageToUrl;