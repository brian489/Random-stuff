import { Box } from "@mui/material";
import BackButton from "../components/BackButton";
import { contentContainerStyle } from "../styles";

function Page3() {
  return (
    <Box sx={contentContainerStyle}>
      <BackButton />
      <div>
        <h1>Page 3</h1>
        <p>This is the content of Page 3.</p>
      </div>
    </Box>
  );
}
export default Page3;