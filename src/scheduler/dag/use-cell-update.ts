import { Edge, Graph } from "@antv/x6";
import { truncateText } from "@transquant/utils";
import { Coordinate, TaskType } from "./types";
import { useCustomCellBuilder } from "./use-custom-cell-builder";

interface Options {
  graph?: Graph;
}

export function useCellUpdate(options: Options) {
  const { graph } = options;
  const { buildNode, buildEdge } = useCustomCellBuilder();
  function addNode(
    id: string,
    type: TaskType,
    name: string,
    flag: string,
    coordinate: Coordinate = { x: 100, y: 100 }
  ) {
    const node = buildNode(id, type, name, flag, coordinate);
    graph?.addNode(node);
  }

  function removeNode(id: string) {
    graph?.removeNode(id);
  }

  function setNodeName(id: string, newName: string) {
    const node = graph?.getCellById(id);
    if (node) {
      const truncation = truncateText(newName, 18);
      node.attr("title/text", truncation);
      node.setData({ taskName: newName });
    }
  }

  function setNodeFillColor(id: string, color: string) {
    const node = graph?.getCellById(id);
    if (!node) {
      return false;
    }
    node.attr("rect/fill", color);
  }

  const getNodeEdge = (id: string): Edge[] => {
    const node = graph?.getCellById(id);
    if (!node) return [];
    const edges = graph?.getConnectedEdges(node);
    return edges || [];
  };

  const setNodeEdge = (id: string, preTaskCode: number[]) => {
    const edges = getNodeEdge(id);
    if (edges?.length) {
      edges.forEach((edge) => {
        if (edge.getTargetNode()?.id === id) {
          graph?.removeEdge(edge);
        }
      });
    }
    preTaskCode?.forEach((task) => {
      graph?.addEdge(buildEdge(String(task), id));
    });
  };

  return {
    addNode,
    removeNode,
    setNodeName,
    setNodeFillColor,
    setNodeEdge,
  };
}

export default {};
