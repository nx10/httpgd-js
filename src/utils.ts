/**
 * Simple implementation of a generic state change listener. Keeps track of the
 * previous state.
 */
export class StateChangeListener<T> {
  private fun: ((newState: T, oldState?: T) => void)[] = [];
  private oldState?: T;

  /**
   * Notify subscribers of state change.
   *
   * @param newState New state.
   */
  public notify(newState: T): void {
    for (let i = 0; i < this.fun.length; ++i) {
      this.fun[i](newState, this.oldState);
    }
    this.oldState = newState;
  }

  /**
   * Listen to state changes.
   *
   * @param fun Function to be called on state changes.
   */
  public subscribe(fun: (newState: T, oldState?: T) => void): void {
    this.fun.push(fun);
  }
}
