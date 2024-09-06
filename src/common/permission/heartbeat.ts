const workerFn = () => {
  const HEART_BEAT_DURATION = 1000 * 20;
  let interval: NodeJS.Timeout;

  self.onmessage = function (event) {
    if (event.data === "start") {
      interval = setInterval(function () {
        self.postMessage("heartbeat");
      }, HEART_BEAT_DURATION);
    } else if (event.data === "stop") {
      clearInterval(interval);
    }
  };
};

let code = workerFn.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const script = URL.createObjectURL(blob);

export default script;
