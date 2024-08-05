"use client";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export default function ThemedToaster() {
  const { theme } = useTheme();

  return <Toaster theme={theme === "dark" ? "dark" : "light"} richColors />;
}
