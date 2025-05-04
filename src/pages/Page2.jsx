import { Box } from "@mui/material";
import BackButton from "../components/BackButton";
import { contentContainerStyle } from "../styles";

function Page2() {
  return (
    <Box sx={contentContainerStyle}>
    <BackButton />
    <div>
      <h1>Page 2</h1>
      <p>This is the second page.</p>
    </div>
    </Box>
  );
}
export default Page2;