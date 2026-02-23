type MapCanvasProps = {
  heightClassName?: string;
  title?: string;
};

export const MapCanvas = ({
  heightClassName = "h-[420px]",
  title = "Map preview",
}: MapCanvasProps) => {
  return (
    <div
      className={`rounded-3xl border border-(--nav-border) bg-(--nav-surface) p-5 shadow-(--nav-shadow) ${heightClassName}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-(--nav-text)">{title}</h2>
        <span className="text-xs text-(--nav-muted)">Google Maps API</span>
      </div>
      <div className="mt-4 h-full rounded-2xl border border-dashed border-(--nav-border) bg-[linear-gradient(135deg,rgba(14,165,233,0.08),rgba(245,158,11,0.08))]" />
    </div>
  );
};
