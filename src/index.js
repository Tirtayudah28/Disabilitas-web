// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/globals.css";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import { SnackbarProvider } from "notistack";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <SnackbarProvider
      maxSnack={2}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      autoHideDuration={2500}
    >
      <App />
    </SnackbarProvider>
  </Provider>
);
