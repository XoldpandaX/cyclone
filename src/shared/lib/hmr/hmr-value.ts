export class HmrValue<T> {
  private value: T | null

  constructor(key: string, hot: ImportMeta['hot']) {
    this.value = (hot?.data[key] as T | undefined) ?? null

    if (hot) {
      hot.accept()
      hot.dispose((data) => {
        data[key] = this.value
      })
    }
  }

  get(): T | null {
    return this.value
  }

  set(value: T): void {
    this.value = value
  }
}
