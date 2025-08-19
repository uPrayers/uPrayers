// components/DonateButton.tsx
export function DonateButton() {
  const url = process.env.NEXT_PUBLIC_STRIPE_DONATION_URL!;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-2xl px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 shadow"
    >
      Donate
    </a>
  );
}
