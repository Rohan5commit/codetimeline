import { RepoInput } from '@/components/RepoInput'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#050508] px-6">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/8 blur-[120px]" />
        <div className="absolute right-1/4 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-violet-600/8 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-800/6 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-xl">
        {/* Logo mark */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6.75v6.75" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Code<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Timeline</span>
          </h1>
          <p className="mt-3 text-base text-zinc-500 md:text-lg">
            Turn any GitHub repo into a beautiful visual history
          </p>

          {/* Feature pills */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {['AI Chapter Names', 'Contributor Journey', 'Language Evolution', 'Scroll Animations'].map((f) => (
              <span
                key={f}
                className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-zinc-500"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <RepoInput />

        <p className="mt-8 text-center text-xs text-zinc-700">
          Works with any public GitHub repository
        </p>
      </div>
    </main>
  )
}
