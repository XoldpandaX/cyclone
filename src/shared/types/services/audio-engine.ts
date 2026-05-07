// interfaces in TypeScript don't implicitly satisfy index signatures
// eslint-disable-next-line ts/consistent-type-definitions
export type AudioEngineEvents = {
  timeUpdate: (playbackPosition: number) => void
  pause: () => void
  stop: () => void
  setVolume: (percent: number) => void
}

export interface IAudioEngine {
  load: (buffer: ArrayBuffer) => Promise<void>
  play: () => void
  seek: (playbackPosition: number) => void
  pause: () => void
  setVolume: (percent: number) => void
  on: <E extends keyof AudioEngineEvents>(event: E, handler: AudioEngineEvents[E]) => void
}
