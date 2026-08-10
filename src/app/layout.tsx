import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ReyCars | Centro de Enseñanza Automovilística",
    template: "%s | ReyCars",
  },
  description:
    "Centro de Enseñanza Automovilística ReyCars. Atrévete a rodar con nosotros.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
