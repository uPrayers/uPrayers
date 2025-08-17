const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL || "/donate";

export default function DonateSection() {
  return (
    <section
      id="donate"
      className="py-16 px-4 border-t"
      aria-labelledby="support-heading"
    >
      <div className="max-w-3xl mx-auto">
        {/* Glow panel */}
        <div className="rounded-2xl shadow-xl ring-1 ring-black/5"
             style={{
               background: 'linear-gradient(180deg, #fff2d9 0%, #fff7ea 60%, #fffdfa 100%)'
             }}>
          <div className="px-6 sm:px-10 py-10 text-center">
            <h2 id="support-heading" className="text-3xl font-bold tracking-tight text-[color:var(--upr-ink)]">
              Support uPrayers
            </h2>
            <p className="mt-3 text-base leading-7 text-[color:var(--upr-muted)]">
              Your donation helps us keep the prayers flowing. We rely on generous hearts like yours
              to maintain the site and spread hope worldwide.
            </p>

            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-md px-6 py-3 text-white font-medium
                         bg-[color:var(--upr-amber-500)] hover:bg-[color:var(--upr-amber-600)]
                         shadow-md focus:outline-none focus:ring-4 focus:ring-[color:var(--upr-ring)]"
            >
              Donate with Stripe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
