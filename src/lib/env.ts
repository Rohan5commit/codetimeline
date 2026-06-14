/**
 * Asserts that a required environment variable is set.
 * Throws a clear error on missing values so callers surface
 * "Server misconfigured" rather than a cryptic downstream failure.
 */
export function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Server misconfigured: missing environment variable ${key}`)
  return value
}
