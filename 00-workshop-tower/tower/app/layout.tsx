import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IA Master Lab Tower",
  description: "Torre de desafios interativa para o workshop IA Master Lab",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen`}
      >
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              IA Master Lab Tower
            </h1>
            <p className="text-slate-300">
              Conquiste cada desafio e domine a inteligência artificial
            </p>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
