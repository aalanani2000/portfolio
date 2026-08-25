import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <p className="mono-label mb-4">ERROR 404 // SIGNAL LOST</p>
      <h1 className="font-display text-[clamp(4rem,14vw,9rem)] font-bold leading-none tracking-tighter text-hi">
        404
      </h1>
      <p className="mt-4 max-w-md text-mid">
        This route does not exist in the system. The node you are looking for
        was never deployed — or it moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
      >
        ← Reconnect to base
      </Link>
    </main>
  );
}
