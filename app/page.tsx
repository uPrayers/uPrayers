// app/page.tsx (minimal tweak)
import PrayerForm from "../components/PrayerForm";
import DonateSection from "../components/DonateSection";
import SiteFooter from "../components/SiteFooter";

export default function Home() {
  return (
    <main className="relative">
      {/* Subtle top glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-64
                      bg-[radial-gradient(60%_60%_at_50%_0%,rgba(245,158,11,.18),transparent)]" />
      <div className="grid relative" style={{ gap: 22 }}>
        <PrayerForm />
      </div>
      <DonateSection />
      <SiteFooter />
    </main>
  );
}
