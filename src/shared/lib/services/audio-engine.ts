import type { AudioEngineEvents, IAudioEngine } from '../../types/services/audio-engine'
import EventEmitter from './event-emitter'

export default class AudioEngine extends EventEmitter<AudioEngineEvents> implements IAudioEngine {
  private _ctx = new AudioContext()
  private _gain = new GainNode(this._ctx)
  private _tickId: ReturnType<typeof setInterval> | null = null

  // Data
  private _audioBuffer: AudioBuffer | null = null
  private _source: AudioBufferSourceNode | null = null
  private _offset = 0 // текущая позиция (сек)
  private _startedAt = 0 // когда начали играть (ctx.currentTime)

  // State
  private _playing = false

  constructor() {
    super()
    this._gain.connect(this._ctx.destination)
  }

  public async load(buffer: ArrayBuffer): Promise<void> {
    // TODO: unload and load new track when _playing === true
    try {
      this._audioBuffer = await this._ctx.decodeAudioData(buffer)
    } catch (e) {
      const error = new Error(`Failed to decode audio data: ${e instanceof Error ? e.message : 'Unknown error'}`, {
        cause: e,
      })
      console.error(error)
      throw error
    }
  }

  // ---- PLAY ----
  play(): void {
    if (!this._audioBuffer) return
    if (this._playing) return

    this.createSource(this._offset)
    this._playing = true
    this.startTick()
  }

  // ---- PAUSE ----
  pause(): void {
    if (!this._playing) return

    this._source?.stop()

    this._offset = this.calcOffset()
    this._playing = false
    this.stopTick()
  }

  // ---- STOP ----
  private stop(): void {
    this._source?.stop()
    this._source = null

    this._offset = 0
    this._playing = false
    this.stopTick()
  }

  private createSource(offset: number): void {
    if (!this._audioBuffer) return

    const src = this._ctx.createBufferSource()
    src.buffer = this._audioBuffer
    src.connect(this._gain)

    src.onended = () => {
      // важно: чтобы не сбивалось при seek/pause
      if (this._playing) {
        this.stop()
      }
    }

    this._startedAt = this.calcStartedAt(offset)
    this._source = src

    src.start(0, offset)
  }

  private calcOffset(): number {
    return this._ctx.currentTime - this._startedAt
  }

  private calcStartedAt(offset: number): number {
    return this._ctx.currentTime - offset
  }

  private startTick(): void {
    this._tickId = setInterval(() => {
      const time = this.calcOffset()
      this.emit('onTimeUpdate', time)
    }, 100)
  }

  private stopTick(): void {
    if (!this._tickId) return
    clearInterval(this._tickId)
    this._tickId = null
  }
}
