export function number(value: string, name: string): number {
  const result = Number(value)
  if (!Number.isFinite(result))
    throw new Error(`${name} must be a number: ${value}`)
  return result
}
