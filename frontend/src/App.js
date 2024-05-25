import "./App.css";
import UploadFilePage from "./pages/UploadFilePage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UploadFilePage />
    </ThemeProvider>
  );
}

export default App;
