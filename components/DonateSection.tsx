const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL || "/donate";

export default function DonateSection() {
  return (
    <section
      id="donate"
      className="py-16 px-4 border-t"
      aria-labelledby="support-heading"
    >
      <div className="max-w-3xl mx-auto">
        <div className="card section text-center">
          <h2 id="support-heading">Support uPrayers</h2>
          <p className="lead">
            Your donation helps us keep the prayers flowing. We rely on generous hearts like yours
            to maintain the site and spread hope worldwide.
          </p>

          <div className="mt-4">
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn primary"
            >
              Donate with Stripe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
