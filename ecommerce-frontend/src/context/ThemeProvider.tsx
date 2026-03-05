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
  children: ReactNode; //告訴 TypeScript：「這個元件可以用來包住其他元件或內容，我們把那些東西叫做 children。」
  //children:React 的特殊保留字，代表「被包在這個元件裡面的所有內容」
  //ReactNode: TypeScript 型別，表示「任何 React 可以渲染的東西」
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined); //初始值設成 undefined

//Provider — 把資料「放進」容器並廣播
export function ThemeProvider({ children }: ThemeProviderProps) {
  // 1. 建立 theme 狀態（從 localStorage 讀取上次的設定）
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme"); // 可能是 "dark"、"light"，或 null（從來沒存過）
    return saved === "dark" ? "dark" : "light";
  }); //theme 狀態的初始值從 localStorage 讀取，用函式當初始值（Lazy Initializer：只在第一次渲染時執行一次）

  // 2. 每次 theme 變動，更新 HTML 屬性和 localStorage
  useEffect(() => {
    document.documentElement.setAttribute("theme-mode", theme); //讓整個網站切換顏色。
    localStorage.setItem("theme", theme); //把目前主題存進 localStorage，下次重新整理還會記得
  }, [theme]);

  // 3. 定義切換函式
  const toggleTheme = () => 
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // 4. 用 Provider 包住子元件，把資料傳進「公告欄」
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      {/* {children} 是包在 Provider 裡面的所有子元件。只要被 Provider 包住的元件，都能取用這些資料 */}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  //custom hook
  //任何 component 都可以用 useTheme() 拿到這些資料，不需要 props 傳來傳去
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // 沒有被 Provider 包住的話，ctx 會是 undefined，報錯提示
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx; // 回傳 { theme, toggleTheme }
}
