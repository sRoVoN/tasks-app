import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Assert that the element is not null
const rootElement = document.getElementById("root")!;

// Create a root and render the app without StrictMode
const root = ReactDOM.createRoot(rootElement);
root.render(
  <App />
);
