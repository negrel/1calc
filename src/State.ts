class State<T> {
  #inner: T
  #onChange: (oldValue: T, newValue: T) => void

  constructor ({
    initial,
    onChange
  }: {
    initial: T
    onChange: (oldValue: T, newValue: T) => void
  }) {
    this.#inner = initial
    this.#onChange = onChange
  }

  set (newValue: T): void {
    if (newValue !== this.#inner) {
      this.#onChange(this.#inner, newValue)
      this.#inner = newValue
    }
  }

  get (): T {
    return this.#inner
  }
}

export default State
