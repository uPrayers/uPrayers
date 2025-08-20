// app/layout.tsx
import "./globals.css";
import { Inter, Crimson_Pro } from "next/font/google";
import DonateButton from "../components/DonateButton";

export const metadata = {
  metadataBase: new URL("https://www.uprayers.com"),
  title: "uPrayers — Share a Prayer, Be Prayed For",
  description:
    "Post your prayer, choose your faith tradition, and join a warm community lifting each other up in prayer.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, maxImagePreview: "large" as const },
  openGraph: {
    type: "website",
    siteName: "uPrayers",
    url: "https://www.uprayers.com/",
    title: "uPrayers — Share a Prayer, Be Prayed For",
    description:
      "Post your prayer and join a welcoming community prayer wall.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Hands joined in prayer with warm candlelight." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "uPrayers — Share a Prayer, Be Prayed For",
    description:
      "Post your prayer and join a welcoming community prayer wall.",
    images: ["/og-image.jpg"],
  },
  icons: { icon: "/favicon.ico" },
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
                <DonateButton />
              </nav>
            </div>
          </header>
          <main className="container site-main fade-in">{children}</main>
          <footer className="site-footer"></footer>

          {/* --- Static JSON-LD: WebSite + WebPage --- */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": ["WebSite", "WebPage"],
                name: "uPrayers",
                url: "https://www.uprayers.com/",
                description:
                  "Post your prayer, choose your faith tradition, and join a warm community lifting each other up in prayer.",
                inLanguage: "en",
                publisher: { "@type": "Organization", name: "uPrayers", url: "https://www.uprayers.com/" }
              }),
            }}
          />
        </div>
      </body>
    </html>
  );
}
