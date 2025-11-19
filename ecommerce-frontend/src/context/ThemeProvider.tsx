import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

//建立全站可共享的主題狀態（light/dark），並提供切換方法（toggleTheme）
type Theme = "light" | "dark";

type ThemeContextValue = {
  //先規劃 Context 裡會放什麼。
  theme: Theme;
  toggleTheme: () => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined); //初始值設成 undefined

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("theme-mode", theme); //讓整個網站切換顏色。
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  //custom hook
  //任何 component 都可以用 useTheme() 拿到這些資料，不需要 props 傳來傳去
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
