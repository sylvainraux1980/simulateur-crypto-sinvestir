import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Simulateur Crypto — S'investir",
  description: 'Simulez vos investissements en cryptomonnaies avec des données historiques réelles',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
