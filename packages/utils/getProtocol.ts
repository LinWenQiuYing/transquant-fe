type Protocol = "http" | "https";

export default function getProtocol(): Protocol {
  const { protocol } = document.location;
  let protocolStr = "http" as Protocol;

  if (protocol === "https:") {
    protocolStr = "https";
  }

  return protocolStr;
}
