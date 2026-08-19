import React from "react";
import ReactDOM from "react-dom/client";
import RailApp from "./components/RailApp.jsx";
import "./styles.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RailApp />
    </React.StrictMode>
  );
}
