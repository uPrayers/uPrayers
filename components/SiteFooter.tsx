export default function SiteFooter() {
  return (
    <footer className="text-center text-sm text-gray-500 bg-white border-t">
      <div className="py-8 flex flex-col items-center space-y-4">
        {/* You could drop another subtle link or tagline here if desired */}
        <div>© {new Date().getFullYear()} uPrayers.com — A place for every faith</div>
      </div>
    </footer>
  );
}
