// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Aplikace pro vyhledávání filmů',
  description: 'Vyhledávejte filmy pomocí Next.js, TypeScriptu a Tailwind CSS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
