import PrayerForm from "@/components/PrayerForm";
import DonateSection from "@/components/DonateSection";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <main>
      {/* Main content container mirrors your existing layout spacing */}
      <div className="grid" style={{ gap: 22 }}>
        <PrayerForm />
      </div>

      {/* Page-level donate and footer */}
      <DonateSection />
      <SiteFooter />
    </main>
  );
}
