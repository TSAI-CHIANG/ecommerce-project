import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeProvider";
import "bootstrap/dist/css/bootstrap.min.css"; // 先載入 Bootstrap
import "./index.css"; // 再載入你的主題 CSS，蓋掉它

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
