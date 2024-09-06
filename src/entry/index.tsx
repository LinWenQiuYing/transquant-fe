import ReactDOM from "react-dom/client";
import app from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.createRoot(document.getElementById("tq-root") as HTMLElement).render(
  app
);

reportWebVitals();

export { registerApp } from "./registerApp";

export default {};
