import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-providers";
import { cn } from "@/lib/utils";
import "@uploadthing/react/styles.css";
const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BuzzBox",
  description: "this is Group Chat App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="buzzbox-theme"
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
