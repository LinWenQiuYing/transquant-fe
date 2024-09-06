import { useEffect } from "react";
import workerScript from "./heartbeat";

export default function useHeartBeat(options: {
  callback: Function;
  checkToken: boolean;
}) {
  const { callback, checkToken } = options;

  useEffect(() => {
    if (!checkToken) return;
    const worker = new Worker(workerScript);

    worker.onmessage = function (event) {
      if (event.data === "heartbeat") {
        callback();
      }
    };
    worker.postMessage("start");

    return () => {
      worker.postMessage("stop");
      worker.terminate();
    };
  }, [checkToken]);
}
