export const metadata = {
  title: "uPrayers",
  description: "Receive and share short, compassionate prayers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
