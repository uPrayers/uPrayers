// app/layout.tsx
import "./globals.css";
import { Inter, Crimson_Pro } from "next/font/google";
import Link from "next/link";

export const metadata = {
  title: "uPrayers",
  description: "Receive and share short, compassionate prayers.",
};

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const crimson = Crimson_Pro({ subsets: ["latin"], display: "swap", variable: "--font-serif" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${crimson.variable}`}>
      <body>
        <div className="site">
          <header className="site-header">
            <div className="container header-inner">
              <div className="brand">uPrayers</div>
              <nav className="actions">
                <a
  href="https://donate.stripe.com/14AcN6bRv0G3a803gnao800"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center rounded-2xl px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 shadow"
>
  Donate
</a>

              </nav>
            </div>
          </header>
          <main className="container site-main fade-in">{children}</main>
          <footer className="site-footer">
            <div className="container">© {new Date().getFullYear()} uPrayers</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
