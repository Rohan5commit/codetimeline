export type ErrorCode = 'RATE_LIMIT' | 'NOT_FOUND' | 'FORBIDDEN' | 'NVIDIA_ERROR' | 'UNKNOWN'

export class AppError extends Error {
  code: ErrorCode

  constructor(code: ErrorCode, message: string) {
    super(message)
    this.name = 'AppError'
    this.code = code
  }
}

export function isAppError(err: unknown, code?: ErrorCode): err is AppError {
  return err instanceof AppError && (code === undefined || err.code === code)
}
