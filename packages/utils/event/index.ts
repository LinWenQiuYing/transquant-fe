import { AnyObject } from "../type";
import createEvent from "./createEvent";

type Actions = AnyObject;

export default class ActionEvent {
  event = createEvent<AnyObject>();

  off = this.event.off;

  once = this.event.once;

  on = (actions: Partial<Actions>): void => {
    const keys = Object.keys(actions) as (keyof typeof actions)[];

    keys.forEach((key) => {
      this.event.on(key, actions[key]!);
    });
  };

  emit = (act: keyof AnyObject, ...args: any[]): any[] => {
    return this.event.emitWithReturns(act, ...args);
  };
}
