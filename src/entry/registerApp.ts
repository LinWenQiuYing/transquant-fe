import { useStores } from "@transquant/app/hooks";
import {
  initGlobalState,
  MicroAppStateActions,
  registerMicroApps,
  start,
} from "qiankun";
import microConfig from "./micro.config";

export function registerApp() {
  registerMicroApps(microConfig.microApps, {
    beforeLoad() {
      return Promise.resolve();
    },
  });

  start({
    sandbox: {
      experimentalStyleIsolation: true,
    },
  });
}

export default function MicorApp() {
  const state = {
    activeApp: "",
  };

  const actions: MicroAppStateActions = initGlobalState(state);

  const { onActiveAppChange } = useStores().appStore;

  actions.onGlobalStateChange((state) => {
    onActiveAppChange(state.activeApp || "TransMatrix");
  });

  return null;
}
