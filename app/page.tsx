// app/page.tsx
import PrayerForm from "../components/PrayerForm";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-slate-700 mb-8">
          Describe your situation, choose your faith tradition, and receive a short prayer.
        </p>

        <PrayerForm />
      </div>
    </main>
  );
}
