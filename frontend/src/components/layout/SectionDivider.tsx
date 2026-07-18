export default function SectionDivider() {
  return (
    <div className="relative h-24 w-full overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 animate-wave-flow opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0px, transparent 46px, rgba(201,162,77,0.35) 47px, transparent 48px, transparent 94px)",
          backgroundSize: "200% 100%",
        }}
      />
      <div
        className="absolute inset-0 animate-wave-flow opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0px, transparent 70px, rgba(245,241,231,0.2) 71px, transparent 72px, transparent 140px)",
          backgroundSize: "200% 100%",
          animationDuration: "12s",
          animationDirection: "reverse",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep/40 to-deep" />
    </div>
  );
}
