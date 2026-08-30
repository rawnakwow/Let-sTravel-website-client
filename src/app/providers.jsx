"use client";

import { ThemeProvider } from "@teispace/next-themes";
import { Toaster } from "react-hot-toast";
import SessionSync from "@/components/SessionSync";

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      storage="local"
    >
      {children}

      <SessionSync />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
        }}
      />
    </ThemeProvider>
  );
}