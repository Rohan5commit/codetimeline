export const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  Dart: '#00B4AB',
  PHP: '#4F5D95',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Scala: '#c22d40',
  Haskell: '#5e5086',
}

export function getLangColor(lang: string): string {
  return LANG_COLORS[lang] ?? `hsl(${Math.abs(lang.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 360}, 60%, 55%)`
}
