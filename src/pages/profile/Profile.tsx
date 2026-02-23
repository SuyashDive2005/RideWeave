import { PageShell } from "@/components/layout/PageShell";

export default function Profile() {
  return (
    <div className="bg-(--background) text-(--foreground)">
      <PageShell
        title="Profile"
        description="Manage your personal details and preferences."
      >
        <div className="rounded-3xl border border-(--nav-border) bg-(--nav-surface) p-6 shadow-(--nav-shadow)">
          <h2 className="text-lg font-semibold text-(--nav-text)">
            Profile settings
          </h2>
          <p className="mt-2 text-sm text-(--nav-muted)">
            Update name, phone, and email visibility here.
          </p>
        </div>
      </PageShell>
    </div>
  );
}
