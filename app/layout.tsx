import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"]
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

export const metadata: Metadata = {
  title: "Gourmet Menu",
  description: "Experience our delicious menu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(playfair.variable, inter.variable)}>
      <body className={cn("font-sans min-h-screen antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100")}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <main className="mx-auto max-w-md min-h-screen shadow-2xl overflow-hidden relative bg-white dark:bg-gray-950">
             {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
