export function BrandCube({ className = "", color = "#f54733" }: { className?: string; color?: string }) {
  return (
    <span
      aria-label="ArtisanS icon"
      className={className}
      role="img"
      style={{
        backgroundColor: color,
        display: "block",
        maskImage: "url('/assets/icons/icon.png')",
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskImage: "url('/assets/icons/icon.png')",
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
