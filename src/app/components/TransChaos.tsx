import { useMount } from "ahooks";

import { registerApp } from "@transquant/entry";

export default function TransChaos() {
  useMount(() => {
    registerApp();
  });

  return <div id="container" />;
}
