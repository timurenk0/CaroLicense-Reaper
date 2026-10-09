import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/COMPONENTS/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carolicense Reaper",
  description: "Automated Microsoft License Removal Tool for University Internal Use",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-screen w-screen flex flex-col overflow-x-hidden">
        <Header />
        <div className="flex-1 w-full min-h-0 overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
