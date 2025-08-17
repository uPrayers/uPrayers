// components/DonateButton.tsx
export default function DonateButton() {
  // swap in your real Stripe checkout link
  const url = "https://buy.stripe.com/your_real_checkout_link";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-2xl px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 shadow focus:outline-none focus:ring-2 focus:ring-emerald-400"
      role="button"
    >
      Donate
    </a>
  );
}
