import PrayerForm from "../components/PrayerForm";
import DonateSection from "../components/DonateSection";
import SiteFooter from "../components/SiteFooter";

export default function Home() {
  return (
    <main>
      <div className="grid" style={{ gap: 22 }}>
        <PrayerForm />
      </div>

      {/* Extra breathing room above the donate block */}
      <div className="mt-16">
        <DonateSection />
      </div>

      {/* Hard spacer so the separation is unmistakable */}
      <div className="h-10" />

      <SiteFooter />
    </main>
  );
}
