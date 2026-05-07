import type { AudioEngineEvents, IAudioEngine } from '../../types/services/audio-engine'
import { clamp } from '../math'
import EventEmitter from './event-emitter'

export default class AudioEngine extends EventEmitter<AudioEngineEvents> implements IAudioEngine {
  private _ctx = new AudioContext()
  private _gain = new GainNode(this._ctx)
  private _tickId: ReturnType<typeof setInterval> | null = null

  // Data
  private _audioBuffer: AudioBuffer | null = null
  private _source: AudioBufferSourceNode | null = null
  private _offset = 0 // current playback position in seconds
  private _startedAt = 0 // context time at playback start

  // State
  private _playing = false

  constructor() {
    super()
    this._gain.connect(this._ctx.destination)
  }

  public async load(buffer: ArrayBuffer): Promise<void> {
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

  public play(): void {
    if (!this._audioBuffer) return
    if (this._playing) return

    this.createSource(this._offset)
    this._playing = true
    this.startTick()
  }

  public seek(playbackPosition: number): void {
    if (!this._audioBuffer) return
    if (playbackPosition < 0 || playbackPosition > this._audioBuffer.duration) return

    const wasPlaying = this._playing

    this.pause()
    this._offset = playbackPosition

    if (wasPlaying) this.play()
  }

  public pause(): void {
    if (!this._playing) return

    this._source?.stop()

    this._offset = this.calcOffset()
    this._playing = false
    this.stopTick()
    this.emit('pause')
  }

  public setVolume(percent: number): void {
    const newVolume = clamp(percent / 100, { min: 0, max: 1 })
    const currentVolume = this._gain.gain.value
    if (newVolume === currentVolume) return

    this._gain.gain.setValueAtTime(newVolume, this._ctx.currentTime)
  }

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

    // onended fires on both natural end and manual stop() — src identity check
    // prevents seek/pause from triggering stop() on the newly created source
    src.onended = () => {
      if (this._playing && this._source === src) {
        this.stop()
        this.emit('stop')
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
      this.emit('timeUpdate', this.calcOffset())
    }, 100)
  }

  private stopTick(): void {
    if (!this._tickId) return
    clearInterval(this._tickId)
    this._tickId = null
  }
}
