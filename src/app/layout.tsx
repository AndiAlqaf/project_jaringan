import type { Metadata } from "next";
import { Syne, Space_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  weight: ["500", "700", "800"],
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  weight: ["600", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALFRA Connect | Network Monitoring System",
  description: "Aplikasi Monitoring Jaringan & Memantau Kinerja Bandwidth Kantor Tempat Magang (Kelompok 1 - PT Primus & PT Anugrah Inti Spektra)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${syne.variable} ${spaceGrotesk.variable} ${orbitron.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-[#0a0714] text-slate-100 maxi-grid selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}


