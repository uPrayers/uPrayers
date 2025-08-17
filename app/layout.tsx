// app/layout.tsx
import "./globals.css";
import { Inter, Crimson_Pro } from "next/font/google";
import DonateButton from "../components/DonateButton"; // ✅ import your Stripe button

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
                {/* ✅ Stripe Donate button */}
                <DonateButton />
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
