export class StateChangeListener<T> {
  private fun: ((newState: T, oldState?: T) => void)[] = [];
  private oldState?: T;

  public notify(newState: T): void {
    for (let i = 0; i < this.fun.length; ++i) {
      this.fun[i](newState, this.oldState);
    }
    this.oldState = newState;
  }

  public subscribe(fun: (newState: T, oldState?: T) => void): void {
    this.fun.push(fun);
  }
}
