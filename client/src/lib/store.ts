export function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<(value: T) => void>();

  return {
    get(): T {
      return state;
    },
    set(next: T) {
      if (Object.is(state, next)) return;
      state = next;
      listeners.forEach((l) => l(state));
    },
    update(fn: (prev: T) => T) {
      this.set(fn(state));
    },
    subscribe(listener: (value: T) => void): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export type Store<T> = ReturnType<typeof createStore<T>>;
