import { ThemeProvider } from "@material-ui/core/styles";
import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { MoralisProvider } from "react-moralis";
import MainLayout from "./components/MainLayout";

let theme = createTheme({palette: {type: 'dark'}});
theme = responsiveFontSizes(theme);

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

function App() {
  return (
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
      <ThemeProvider theme={theme}>
        <MainLayout />
      </ThemeProvider>
    </MoralisProvider>
  );
}

export default App;
