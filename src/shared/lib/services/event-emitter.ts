import { createNanoEvents, type Emitter, type Unsubscribe } from 'nanoevents'

// eslint-disable-next-line ts/no-explicit-any
type EventsMap = Record<string, (...args: any[]) => void>

export default class EventEmitter<T extends EventsMap> {
  private readonly _emitter: Emitter<T>

  public constructor() {
    this._emitter = createNanoEvents<T>()
  }

  public on<E extends keyof T>(event: E, handler: T[E]): Unsubscribe {
    return this._emitter.on(event, handler)
  }

  public dispose(): void {
    this._emitter.events = {}
  }

  protected emit<E extends keyof T>(event: E, ...args: T[E] extends (...a: infer A) => void ? A : never): void {
    // eslint-disable-next-line ts/no-explicit-any
    ;(this._emitter as any).emit(event, ...args)
  }
}
