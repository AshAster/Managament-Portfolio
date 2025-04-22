import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "./theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "@/scenes/navbar";
import Dashboard from "@/scenes/dashboard";
import Home from "@/scenes/home"
import Coin from "@/scenes/coin"
import Footer from "@/scenes/footer"
import Predictions from "@/scenes/predictions";




function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box width="100%" height="100%" 
          padding="1rem 2rem 4rem 2rem">
            <Navbar />
            <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/coin/:coinId" element={<Coin />} /> 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predictions" element={<Predictions />} />
            </Routes>
            <Footer />
          </Box>
        </ThemeProvider>
      </BrowserRouter>  
    </div>
  );
}

export default App;
