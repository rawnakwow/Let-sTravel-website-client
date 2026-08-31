"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@teispace/next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  function toggleTheme() {
    if (!mounted) return;

    setTheme(
      resolvedTheme === "dark"
        ? "light"
        : "dark"
    );
  }

  // Keep server HTML and first client HTML identical
  if (!mounted) {
    return (
      <button
        type="button"
        className="icon-button"
        aria-label="Toggle color theme"
        disabled
      >
        <Moon
          size={18}
          style={{ visibility: "hidden" }}
        />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="icon-button"
      aria-label={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}