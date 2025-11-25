import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import App from "./App";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "./styles.css";
import { queryClient } from "./utils/queryClient";
import { AuthProvider } from "@utils/auth";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2"
    },
    background: {
      default: "#f5f5f5"
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

