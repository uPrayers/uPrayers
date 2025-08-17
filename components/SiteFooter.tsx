// components/SiteFooter.tsx
export default function SiteFooter() {
  return (
    <footer className="text-center text-sm text-gray-500 bg-white border-t">
      <div className="py-4">
        © {new Date().getFullYear()} uPrayers.com — A place for every faith
      </div>
    </footer>
  );
}
