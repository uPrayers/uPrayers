// components/DonateButton.tsx
export default function DonateButton() {
  const url = "https://donate.stripe.com/14AcN6bRv0G3a803gnao800"; // your Stripe link

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn primary"   // ✅ match your site’s button style
      role="button"
    >
      Donate
    </a>
  );
}
