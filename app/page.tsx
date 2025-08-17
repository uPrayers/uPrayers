// app/page.tsx
import PrayerForm from "../components/PrayerForm";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <PrayerForm />
      </div>
    </main>
  );
}
