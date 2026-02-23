import { PageShell } from "@/components/layout/PageShell";

export default function WalletPage() {
  return (
    <div className="bg-(--background) text-(--foreground)">
      <PageShell
        title="Wallet"
        description="Track wallet balance and recent transactions."
      >
        <div className="rounded-3xl border border-(--nav-border) bg-(--nav-surface) p-6 shadow-(--nav-shadow)">
          <h2 className="text-lg font-semibold text-(--nav-text)">
            Wallet overview
          </h2>
          <p className="mt-2 text-sm text-(--nav-muted)">
            Transaction history will appear here.
          </p>
        </div>
      </PageShell>
    </div>
  );
}
