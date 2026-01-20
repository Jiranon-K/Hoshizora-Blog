"use client";

import React, { useEffect, useState } from "react";

export default function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const savedTheme = localStorage.getItem("theme") || "lofi";
      document.documentElement.setAttribute("data-theme", savedTheme);
    } catch (error) {
      document.documentElement.setAttribute("data-theme", "lofi");
    }
  }, []);
  return <div suppressHydrationWarning>{children}</div>;
}
