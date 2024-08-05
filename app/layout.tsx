import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import SessionWrapper from "@/components/SessionWrapper";
import ThemedToaster from "@/components/ui/ThemedToaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="mx-auto w-2/3">{children}</div>
            <ThemedToaster />
          </ThemeProvider>
        </body>
      </html>
    </SessionWrapper>
  );
}
