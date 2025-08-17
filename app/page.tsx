import PrayerForm from "../components/PrayerForm";
import DonateSection from "../components/DonateSection";
import SiteFooter from "../components/SiteFooter";

export default function Home() {
  return (
    <main>
      <div className="grid" style={{ gap: 22 }}>
        <PrayerForm />
      </div>

      <DonateSection />
      <SiteFooter />
    </main>
  );
}
