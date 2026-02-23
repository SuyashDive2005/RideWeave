import { PageShell } from "@/components/layout/PageShell";

export default function Settings() {
  return (
    <div className="bg-(--background) text-(--foreground)">
      <PageShell
        title="Settings"
        description="Adjust app preferences and notification settings."
      >
        <div className="rounded-3xl border border-(--nav-border) bg-(--nav-surface) p-6 shadow-(--nav-shadow)">
          <h2 className="text-lg font-semibold text-(--nav-text)">
            App settings
          </h2>
          <p className="mt-2 text-sm text-(--nav-muted)">
            Configure theme, alerts, and privacy preferences.
          </p>
        </div>
      </PageShell>
    </div>
  );
}
