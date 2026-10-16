import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
<<<<<<< HEAD
import "./index.css";
import App from "./App.jsx";
=======
import App from "./App.jsx";
import "./index.css";
>>>>>>> 5aabbf4da795051ad6f43d65cf9a742be32a4a5d

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
