const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL || "/donate";

export default function DonateSection() {
  return (
    <section
      id="donate"
      className="py-16 px-4 text-center bg-gradient-to-r from-yellow-100 to-white border-t"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Support uPrayers</h2>
        <p className="mb-6">
          Your donation helps us keep the prayers flowing. We rely on generous hearts like yours
          to maintain the site and spread hope worldwide.
        </p>
        <a
          href={DONATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-yellow-500 text-white py-3 px-6 rounded shadow hover:bg-yellow-600 mb-8"
        >
          Donate with Stripe
        </a>
      </div>
    </section>
  );
}
