// app/page.tsx
import Link from "next/link";
import { DonateButton } from "../components/DonateButton";
import PrayerForm from "../components/PrayerForm";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Top button row */}
      <div className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <h1 className="text-xl font-semibold">uPrayers</h1>

          <div className="flex items-center gap-3">
            <Link
              href="#prayer-form"
              className="inline-flex items-center rounded-2xl px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 shadow"
            >
              Post to Prayer Wall
            </Link>

            <DonateButton />
          </div>
        </div>
      </div>

      {/* Rest of page */}
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-slate-700 mb-8">
          Describe your situation, choose your faith tradition, and receive a short prayer.
        </p>

        <PrayerForm />
      </div>
    </main>
  );
}
