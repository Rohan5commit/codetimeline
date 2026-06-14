# CodeTimeline

**Turn any public GitHub repo into a beautiful, AI-powered visual history timeline.**

Paste a GitHub URL → get a scrollable, animated timeline of the project's entire development story, with AI-named chapters, contributor avatars, language breakdowns, and commit sparklines.

🔗 **[codetimeline.vercel.app](https://codetimeline.vercel.app)**

---

## Features

- **AI chapter naming** — NVIDIA NIM (Llama 3.1 70B) groups commits into narrative eras and names them
- **Scroll-driven animations** — GSAP ScrollTrigger reveals each chapter as you scroll
- **Language donut chart** — D3.js SVG shows the language composition per chapter
- **Commit sparkline** — visualises commit frequency across the repo's lifetime
- **Contributor avatars** — top contributors with GitHub profile links
- **OG image generation** — every timeline page has a share card for X / LinkedIn / Discord
- **GitHub rate limit handling** — graceful errors with retry guidance
- **Skeleton loading** — full shimmer UI while data fetches

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Animations | GSAP + ScrollTrigger |
| Charts | D3.js (SVG, no canvas) |
| AI | NVIDIA NIM — `llama-3.1-nemotron-70b-instruct` |
| Data | GitHub REST API v3 |
| OG images | `next/og` (Satori) |
| Deployment | Vercel |

## Local setup

### Prerequisites

- Node.js 18+
- A [GitHub personal access token](https://github.com/settings/tokens) (public repo read scope)
- An [NVIDIA NIM API key](https://build.nvidia.com/) (free tier available)

### Steps

```bash
git clone https://github.com/Rohan5commit/codetimeline.git
cd codetimeline
npm install
```

Copy the example env file and fill in your keys:

```bash
cp .env.example .env.local
```

```env
NVIDIA_API_KEY=nvapi-...
GITHUB_TOKEN=ghp_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and paste any public GitHub URL.

## Example timelines

- [facebook/react](https://codetimeline.vercel.app/timeline/facebook/react)
- [vercel/next.js](https://codetimeline.vercel.app/timeline/vercel/next.js)
- [expressjs/express](https://codetimeline.vercel.app/timeline/expressjs/express)
- [vuejs/vue](https://codetimeline.vercel.app/timeline/vuejs/vue)

## Project structure

```
src/
├── app/
│   ├── api/og/[owner]/[repo]/   # OG image generation
│   ├── timeline/[owner]/[repo]/ # Timeline page + error/loading states
│   ├── robots.ts                # SEO robots config
│   └── sitemap.ts               # XML sitemap
├── components/
│   ├── TimelineClient.tsx       # Main animated timeline (client)
│   ├── LanguageDonut.tsx        # D3 donut chart
│   ├── CommitSparkline.tsx      # D3 sparkline
│   ├── RepoInput.tsx            # URL input + example buttons
│   └── ShareButton.tsx          # Clipboard share button
└── lib/
    ├── github.ts                # GitHub REST API wrapper
    ├── claude.ts                # NVIDIA NIM integration
    ├── process.ts               # Chapter grouping logic
    └── types.ts                 # TypeScript interfaces
```

## License

MIT
