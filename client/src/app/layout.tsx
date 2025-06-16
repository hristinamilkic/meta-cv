import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RandomCirclesOverlay, { RandomCirclesOverlay2 } from "@/components/Dots";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CV Builder",
  description: "Create and manage your professional CV",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={inter.className}>
        <AuthProvider>
          <div className="fixed inset-0 -z-10 bg-[linear-gradient(200deg,_hsl(var(--mc-primary))_0%,_hsl(var(--mc-secondary))_30%,_hsl(var(--mc-warm))_95%)]" />
          <RandomCirclesOverlay />
          <RandomCirclesOverlay2 />
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
