import "./App.css";
import UploadFilePage from "./pages/UploadFilePage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";
import JobBoardMainPage from "./pages/JobBoardMainPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <UploadFilePage /> */}
      {/*  */}
       <JobBoardMainPage/>
    </ThemeProvider>
  );
}

export default App;
