export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-16 w-16 rounded-full border border-bone/10 border-t-signal animate-spinSlow" style={{ animationDuration: '1.2s' }} />
    </div>
  );
}
