import loadjs from "loadjs";
import { useEffect, useState } from "react";

export default function useLoadjs(name: string, paths: string[]) {
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    if (!loadjs.isDefined(name)) {
      loadjs(paths, name);
    }

    loadjs.ready(name, () => {
      setReady(true);
    });
  }, [isReady]);

  return isReady;
}
