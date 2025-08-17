// components/DonateButton.tsx
export default function DonateButton() {
  const url = "https://donate.stripe.com/14AcN6bRv0G3a803gnao800"; // replace with your Stripe link

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
