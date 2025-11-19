import Form from "react-bootstrap/Form";
import { useTheme } from "../context/ThemeProvider";
import "./ThemeSwitch.css";

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme(); //自訂hook

  const isDark = theme === "dark";

  return (
    <Form.Check
      type="switch"
      id="theme-switch"
      className="theme-switch"
      checked={isDark}
      onChange={toggleTheme}
      label={
        <span className="theme-switch-label">
          {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </span>
      }
    />
  );
}
