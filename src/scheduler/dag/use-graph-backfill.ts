import type { Graph } from "@antv/x6";
import { useEffect } from "react";
import { WorkflowDefinition } from "./types";
import { useCustomCellBuilder } from "./use-custom-cell-builder";

interface Options {
  graph?: Graph;
  definition?: WorkflowDefinition;
}

/**
 * Backfill workflow into graph
 */
export function useGraphBackfill(options: Options) {
  const { graph, definition } = options;

  const { buildGraph } = useCustomCellBuilder();

  useEffect(() => {
    if (graph && definition) {
      graph.fromJSON(buildGraph(definition));
    }
  }, [graph, definition]);

  return {};
}

export default {};
