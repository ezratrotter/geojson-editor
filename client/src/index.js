import React from "react";
import ReactDOM from "react-dom";
import ReactMap from "./components/ReactMap";
import Navbar from "./components/Navbar";
import Container from "@material-ui/core/Container";
import { UserProvider } from "./context/Context";

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <Container>
        <Navbar />
        <ReactMap />
      </Container>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
