import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({
  children,
}) => {
  // Load saved theme
  const [dark, setDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark"
    );
  });

  // Toggle theme
  const toggleTheme = () => {
    setDark((prev) => !prev);
  };

  // Apply theme whenever it changes
  useEffect(() => {
    const theme = dark ? "dark" : "light";

    // Save theme in localStorage
    localStorage.setItem(
      "theme",
      theme
    );

    // Apply theme to HTML element
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    // Optional body class (for future use)
    document.body.classList.toggle(
      "dark",
      dark
    );
  }, [dark]);

  return (
    <ThemeContext.Provider
      value={{
        dark,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () =>
  useContext(ThemeContext);