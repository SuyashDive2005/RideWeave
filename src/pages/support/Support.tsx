import { PageShell } from "@/components/layout/PageShell";

export default function Support() {
  return (
    <div className="bg-(--background) text-(--foreground)">
      <PageShell
        title="Help & support"
        description="Reach out to the RideWeave support team."
      >
        <div className="rounded-3xl border border-(--nav-border) bg-(--nav-surface) p-6 shadow-(--nav-shadow)">
          <h2 className="text-lg font-semibold text-(--nav-text)">
            Support center
          </h2>
          <p className="mt-2 text-sm text-(--nav-muted)">
            Ticketing and FAQs will live here.
          </p>
        </div>
      </PageShell>
    </div>
  );
}
