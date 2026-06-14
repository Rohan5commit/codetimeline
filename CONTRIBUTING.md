# Contributing to CodeTimeline

Thanks for your interest in contributing! CodeTimeline turns any public GitHub repo into an AI-powered visual history timeline. Below is everything you need to get started.

## Ways to contribute

- **Bug reports** — open an issue describing the repo URL that failed, what you expected, and what actually happened
- **Feature ideas** — open an issue tagged `enhancement` before writing code so we can align on scope
- **Pull requests** — fixes, new visualisations, performance improvements, accessibility improvements, tests
- **Docs / examples** — better README copy, new example repos, screenshots, or a video walkthrough

## Development setup

```bash
git clone https://github.com/Rohan5commit/codetimeline.git
cd codetimeline
npm install
cp .env.example .env.local   # fill in NVIDIA_API_KEY and GITHUB_TOKEN
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and paste any public GitHub URL.

### Required env vars

| Variable | Where to get it |
|---|---|
| `NVIDIA_API_KEY` | [build.nvidia.com](https://build.nvidia.com/) — free tier available |
| `GITHUB_TOKEN` | [github.com/settings/tokens](https://github.com/settings/tokens) — public repo read scope |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local dev |

## Project layout (key files)

```
src/
├── app/
│   ├── api/og/[owner]/[repo]/   # OG image route
│   └── timeline/[owner]/[repo]/ # Timeline page
├── components/
│   ├── TimelineClient.tsx       # GSAP scroll animations + chapter rendering
│   ├── LanguageDonut.tsx        # D3 donut chart
│   ├── CommitSparkline.tsx      # D3 sparkline
│   └── ShareButton.tsx          # Clipboard share
└── lib/
    ├── github.ts                # GitHub API wrapper
    ├── claude.ts                # NVIDIA NIM (AI chapter naming)
    └── process.ts               # Chapter grouping logic
```

## Pull request checklist

- [ ] `npm run build` passes with no type errors
- [ ] Tested on at least one real public GitHub repo
- [ ] No new `any` types introduced (existing ones are tracked)
- [ ] `rel="noopener noreferrer"` on any new external `<a>` tags
- [ ] PR description explains *why* the change is needed, not just what it does

## Commit style

Use conventional commits:

```
feat: add contributor heatmap to chapter cards
fix: handle repos with no language data gracefully
perf: lazy-load LanguageDonut with next/dynamic
docs: add example repo for rust/cargo
```

## Good first issues

Look for issues tagged [`good first issue`](https://github.com/Rohan5commit/codetimeline/issues?q=label%3A%22good+first+issue%22) — these are self-contained improvements with clear scope that don't require deep knowledge of the codebase.

Ideas that would make great first contributions:

- Add a "dark/light" toggle (CSS variables are already wired in `globals.css`)
- Show the top commit author avatar next to each chapter header
- Add a "copy embed code" option to the share menu
- Support `owner/repo` shorthand in the URL input (not just full GitHub URLs)
- Add a loading progress percentage while chapters are being generated

## Code of conduct

Be kind. Critique code, not people. We're all here because we like building things.
