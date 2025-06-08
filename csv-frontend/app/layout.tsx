import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./redux/storeProvider";
import ToastProvider from "./clientComponents/ToastProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Csv Management Tool",
  description: "Manage Your Csv Seamlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            {children}
            <ToastProvider/>
        </body>
      </StoreProvider>
    </html>
  );
}
