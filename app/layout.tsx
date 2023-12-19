import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Open_Sans } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-providers";
import { ModalProvider } from "@/components/providers/modal-provider";

import { cn } from "@/lib/utils";

import "./globals.css";
import "@uploadthing/react/styles.css";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "@/components/providers/socket-provider";
import QueryProvider from "@/components/providers/query-provider";

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
            <SocketProvider>
              <QueryProvider>
                <Toaster />
                <ModalProvider />

                {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
