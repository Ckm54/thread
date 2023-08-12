import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import React from "react";
import "../globals.css";

export const metadata = {
  title: "Another Threads",
  description: "A next.js 13 Meta threads application",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} bg-dark-1 bg-cover bg-center relative bg-fixed`}
          style={{ backgroundImage: "url('/background/bg.jpg')" }}
        >
          <div className="absolute -z-50 top-0 right-0 bottom-0 left-0 w-full h-full bg-black/70" />
          <div className="w-full min-h-screen flex justify-center items-center z-50">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
