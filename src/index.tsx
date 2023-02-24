import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Container, createTheme, NextUIProvider } from "@nextui-org/react";
// import "./fonts/RODIN.otf";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = createTheme({
  type: "dark",

  theme: {
    radii: {
      custom: "0px",
      base: "0px",
    },

    shadows: {
      custom:
        "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
    },
  },
});

root.render(
  <NextUIProvider theme={theme}>
    <App />
  </NextUIProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
