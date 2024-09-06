import { Graph } from "@antv/x6";
import React, { Dispatch, SetStateAction } from "react";

export type ContextProps = {
  graph?: Graph;
  setGraph: Dispatch<SetStateAction<Graph | undefined>>;
  readonly: boolean;
  setReadonly: Dispatch<SetStateAction<boolean>>;
};

export const DagContext = React.createContext<ContextProps>({
  graph: undefined,
  setGraph: () => {},
  readonly: false,
  setReadonly: () => {},
});

export default {};
