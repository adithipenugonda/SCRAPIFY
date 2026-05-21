import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


// ==========================================
// CREATE CONTEXT
// ==========================================
const ThemeContext =
  createContext();


// ==========================================
// PROVIDER
// ==========================================
export const ThemeProvider = ({
  children,
}) => {

  // ========================================
  // STATE
  // ========================================
  const [theme, setTheme] =
    useState(
      localStorage.getItem("theme") ||
      "light"
    );


  // ========================================
  // APPLY THEME
  // ========================================
  useEffect(() => {

    document.body.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "theme",
      theme
    );

  }, [theme]);


  // ========================================
  // TOGGLE THEME
  // ========================================
  const toggleTheme = () => {

    setTheme((prevTheme) =>

      prevTheme === "light"
        ? "dark"
        : "light"
    );

  };


  // ========================================
  // VALUES
  // ========================================
  const values = {
    theme,
    toggleTheme,
  };


  return (
    <ThemeContext.Provider
      value={values}
    >

      {children}

    </ThemeContext.Provider>
  );
};


// ==========================================
// CUSTOM HOOK
// ==========================================
export const useTheme = () => {

  return useContext(
    ThemeContext
  );

};