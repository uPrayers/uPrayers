export default function SiteFooter() {
  return (
    <footer className="text-center text-sm text-gray-500 bg-white border-t">
      {/* More top padding so there’s visible space from the donate section */}
      <div className="pt-10 pb-8">
        © {new Date().getFullYear()} uPrayers.com — A place for every faith
      </div>
    </footer>
  );
}
