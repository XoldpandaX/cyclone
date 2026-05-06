// interfaces in TypeScript don't implicitly satisfy index signatures
// eslint-disable-next-line ts/consistent-type-definitions
export type AudioEngineEvents = {
  onTimeUpdate: (seconds: number) => void
}

export interface IAudioEngine {
  load: (buffer: ArrayBuffer) => Promise<void>
  play: () => void
  pause: () => void
  on: <K extends keyof AudioEngineEvents>(event: K, handler: AudioEngineEvents[K]) => void
}
