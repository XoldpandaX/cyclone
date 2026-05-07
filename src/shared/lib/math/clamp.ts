const clamp = (value: number, range: { min: number; max: number }): number => Math.min(range.max, Math.max(range.min, value))
export default clamp
