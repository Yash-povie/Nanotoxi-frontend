import type { Metadata } from "next";
import "./globals.css"; // THIS LINE IS CRITICAL
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Pulse Dashboard",
  description: "Engineering Metrics Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased"> 
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}