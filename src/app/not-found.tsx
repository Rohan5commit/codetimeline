import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#050508] px-6 text-center">
      <div className="mb-6 text-6xl">🔍</div>
      <h1 className="text-2xl font-bold text-white">Repository not found</h1>
      <p className="mt-2 text-zinc-500">
        The GitHub repository doesn&apos;t exist or isn&apos;t public.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        Try another repo
      </Link>
    </main>
  )
}
