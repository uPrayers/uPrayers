// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link"; // ← add this

export const metadata = {
  title: "uPrayers",
  description: "Receive and share short, compassionate prayers.",
};

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="site">
          <header className="site-header">
            <div className="container header-inner">
              <div className="brand">uPrayers</div>
              {/* ← add this nav */}
              <nav className="actions">
                <Link href="/donate" className="btn primary">Donate</Link>
              </nav>
            </div>
          </header>
          <main className="container site-main">{children}</main>
          <footer className="site-footer">
            <div className="container">© {new Date().getFullYear()} uPrayers</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
