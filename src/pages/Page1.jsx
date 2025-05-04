import { Box } from "@mui/material";
import BackButton from "../components/BackButton";
import { contentContainerStyle } from "../styles";

function Page1() {
  return (
    <Box sx={contentContainerStyle}>
      <BackButton />
      <div>
        <h1>Page 1</h1>
        <p>This is the content of Page 1.</p>
      </div>
    </Box>
  );
}
export default Page1;