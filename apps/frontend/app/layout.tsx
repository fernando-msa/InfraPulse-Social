import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "InfraPulse Social",
  description: "Painel de inteligencia social para o estado de Sergipe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
