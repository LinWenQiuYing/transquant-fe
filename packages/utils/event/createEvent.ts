import Eventemitter, { EventNames, ValidEventTypes } from "eventemitter3";

class CustomEvent<T extends ValidEventTypes> extends Eventemitter<T> {
  emitWithReturns(event: EventNames<T>, ...args: any[]): any[] {
    const { _events } = this as any;
    const listeners = _events[event] as any;

    if (!listeners) return [];

    const excu = (listener: any) => {
      if (listener.once) {
        this.removeListener(event, listener.fn, undefined, true);
      }

      return listener.fn.call(listener.context, ...args);
    };

    if (listeners.fn) {
      return [excu(listeners)];
    }

    return listeners.map((listener: any) => {
      return excu(listener);
    });
  }
}

export default function createEvent<
  T extends ValidEventTypes
>(): CustomEvent<T> {
  return new CustomEvent();
}
