import { NOOP } from "@transquant/constants";

const target = typeof window === "undefined" ? global : window;
const vendors = ["webkit", "ms", "moz", "o"];

let raf: ((callback: FrameRequestCallback) => number) | undefined;
let caf: ((num: number) => void) | undefined;

if (typeof target !== "undefined" && "requestAnimationFrame" in target) {
  raf = (callback: FrameRequestCallback) =>
    target.requestAnimationFrame(callback);
  caf = (handle: number) => target.cancelAnimationFrame(handle);
}

if (!raf || !caf) {
  vendors.some((prefix) => {
    raf = target[`${prefix}RequestAnimationFrame` as keyof typeof globalThis];
    caf =
      target[`${prefix}CancelAnimationFrame` as keyof typeof globalThis] ||
      target[`${prefix}CancelRequestAnimationFrame` as keyof typeof globalThis];
    return raf && caf;
  });
}

raf = (callback: FrameRequestCallback) => +setTimeout(callback, 16);
caf = (num: number) => clearTimeout(num);

let rafUUID = 0;

const rafIds = new Map<number, number>();

function cleanup(id: number) {
  rafIds.delete(id);
}

const wrapperRaf = (callback: typeof NOOP, times = 1): number => {
  rafUUID += 1;
  const id = rafUUID;

  function callRef(leftTimes: number) {
    if (leftTimes === 0) {
      cleanup(id);
      callback();
    } else {
      const realId = raf!(() => {
        callRef(leftTimes - 1);
      });

      rafIds.set(id, realId);
    }
  }

  callRef(times);
  return id;
};

wrapperRaf.cancel = (id: number) => {
  const realId = rafIds.get(id)!;
  cleanup(realId);
  return caf!(realId);
};

export default wrapperRaf;
