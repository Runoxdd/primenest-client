import { createContext, useContext, useEffect, useState } from "react";
import { getTheme, setTheme as setThemeUtil, toggleTheme as toggleThemeUtil } from "../lib/utils";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => getTheme());

  useEffect(() => {
    // Initialize theme on mount
    setThemeState(getTheme());
    document.documentElement.setAttribute("data-theme", getTheme());
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    setThemeUtil(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = toggleThemeUtil();
    setThemeState(newTheme);
    return newTheme;
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
};
