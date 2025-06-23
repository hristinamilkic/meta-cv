import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RandomCirclesOverlay, { RandomCirclesOverlay2 } from "@/components/Dots";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "META CV",
  description: "Create and manage your professional CV with META CV",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={montserrat.className}>
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
