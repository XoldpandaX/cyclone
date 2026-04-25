import type { Nullable } from '../../types/maybe'

const orNull = <T>(value: T | null | undefined): Nullable<T> => value ?? null

export default orNull
