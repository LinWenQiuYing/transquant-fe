import { invariant } from "@transquant/utils";

const clipboard = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    try {
      return await navigator.clipboard.writeText(text);
    } catch {
      invariant(false, "The request is not allowed");
    }
  }

  const span = document.createElement("span");
  span.textContent = text;

  span.style.whiteSpace = "pre";

  document.body.appendChild(span);

  const selection = window.getSelection();
  const range = window.document.createRange();
  selection?.removeAllRanges();
  range.selectNode(span);
  selection?.addRange(range);

  let success = false;
  try {
    success = window.document.execCommand("copy");
  } catch (err) {
    invariant(false, "The execCommand request is not allowed");
  }

  selection?.removeAllRanges();
  window.document.body.removeChild(span);

  return success
    ? Promise.resolve()
    : Promise.reject(
        new DOMException("The request is not allowed", "NotAllowedError")
      );
};

export default clipboard;
