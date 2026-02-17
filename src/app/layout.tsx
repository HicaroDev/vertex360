import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "R&V Portal | Gestão Estratégica",
  description: "Portal de acompanhamento e diagnóstico empresarial para clientes R&V Consultores Associados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} font-sans antialiased bg-brand-cream text-brand-slate`}
      >
        {children}
      </body>
    </html>
  );
}
