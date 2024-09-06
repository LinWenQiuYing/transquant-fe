import { PUBLICURL } from "@transquant/constants";

export default function DocumentHtml() {
  return (
    <iframe
      title="document"
      src={`${PUBLICURL}/docs/index.html`}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
