import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TopNavbar from "@/components/shared/navigation/TopNavbar";
import LeftSidebar from "@/components/shared/navigation/LeftSidebar";
import RightSidebar from "@/components/shared/navigation/RightSidebar";
import Footer from "@/components/shared/navigation/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Another threads app",
  description: "A Next.js 12 Meta threads app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <TopNavbar />
          <main className="flex flex-row">
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSidebar />
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
