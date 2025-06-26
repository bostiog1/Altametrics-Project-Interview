import React from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

const DarkMode = () => {
  const [isDarkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    // Add/remove dark class on HTML element
    document.documentElement.classList.toggle("dark", checked);
    // Optional: Save preference to localStorage
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

  // Optional: Initialize from localStorage
  React.useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setDarkMode(savedTheme === "dark");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  return (
    <DarkModeSwitch checked={isDarkMode} onChange={toggleDarkMode} size={20} />
  );
};

export default DarkMode;
