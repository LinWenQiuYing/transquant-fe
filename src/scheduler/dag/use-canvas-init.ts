import { Graph, Markup, Node } from "@antv/x6";
import { MiniMap } from "@antv/x6-plugin-minimap";
import { Scroller } from "@antv/x6-plugin-scroller";
import { Selection } from "@antv/x6-plugin-selection";
import { Snapline } from "@antv/x6-plugin-snapline";
import { useMount } from "ahooks";
import { useRef } from "react";
import { EDGE, NODE, X6_EDGE_NAME, X6_NODE_NAME } from "./dag-config";
import { ContextProps } from "./dag-context";
import DagContextMenu from "./dag-context-menu";

type Options = ContextProps;

export function useCanvasInit(options: Options) {
  const { readonly, graph, setGraph } = options;

  const paper = useRef<HTMLDivElement>();
  const minimap = useRef<HTMLDivElement>();
  const container = useRef<HTMLDivElement>();

  const graphInit = () => {
    Graph.registerNodeTool("contextmenu", DagContextMenu, true);
    const graphInstance = new Graph({
      container: paper.current,
      scaling: {
        min: 0.2,
        max: 2,
      },
      mousewheel: {
        enabled: true,
        modifiers: ["ctrl", "meta"],
      },
      grid: {
        size: 10,
        visible: true,
      },
      interacting: {
        edgeLabelMovable: false,
        nodeMovable: !readonly,
        magnetConnectable: !readonly,
      },
      connecting: {
        // Whether multiple edges can be created between the same start node and end
        allowMulti: false,
        // Whether a point is allowed to connect to a blank position on the canvas
        allowBlank: false,
        // The start node and the end node are the same node
        allowLoop: false,
        // Whether an edge is allowed to link to another edge
        allowEdge: false,
        // Whether edges are allowed to link to nodes
        allowNode: true,
        // Whether to allow edge links to ports
        allowPort: false,
        // Whether all available ports or nodes are highlighted when you drag the edge
        highlight: true,
        createEdge() {
          return graphInstance?.createEdge({
            shape: X6_EDGE_NAME,
          });
        },
        validateConnection(data) {
          const { sourceCell, targetCell } = data;

          if (
            sourceCell &&
            targetCell &&
            sourceCell.isNode() &&
            targetCell.isNode()
          ) {
            const sourceData = sourceCell.getData();
            if (!sourceData) return true;
            if (sourceData.taskType !== "CONDITIONS") return true;
            const edges = graph?.getConnectedEdges(sourceCell);
            if (!edges || edges.length < 2) return true;
            let len = 0;
            return !edges.some((edge) => {
              if (edge.getSourceCellId() === sourceCell.id) {
                len++;
              }
              return len > 2;
            });
          }

          return true;
        },
        validateEdge({ edge }) {
          const sourceData = edge.getSourceNode()?.getData();
          const targetData = edge.getTargetNode()?.getData();
          edge?.setAttrs({
            line: {
              strokeDasharray:
                sourceData.taskExecuteType === "STREAM" ||
                targetData.taskExecuteType === "STREAM"
                  ? "5 5"
                  : "none",
            },
          });
          return true;
        },
      },
      highlighting: {
        nodeAvailable: {
          name: "className",
          args: {
            className: "available",
          },
        },
        magnetAvailable: {
          name: "className",
          args: {
            className: "available",
          },
        },
        magnetAdsorbed: {
          name: "className",
          args: {
            className: "adsorbed",
          },
        },
      },
    });
    graphInstance.use(
      new Selection({
        enabled: true,
        multiple: true,
        rubberband: true,
        rubberEdge: true,
        movable: true,
        showNodeSelectionBox: false,
      })
    );
    graphInstance.use(
      new Snapline({
        enabled: true,
      })
    );
    graphInstance.use(
      new Scroller({
        enabled: true,
      })
    );
    graphInstance.use(
      new MiniMap({
        container: minimap.current,
        scalable: true,
        width: 250,
        height: 150,
      })
    );

    return graphInstance;
  };

  const registerCustomCells = () => {
    Graph.unregisterNode(X6_NODE_NAME);
    Graph.unregisterEdge(X6_EDGE_NAME);
    Graph.registerNode(X6_NODE_NAME, { ...NODE });
    Graph.registerEdge(X6_EDGE_NAME, { ...EDGE });
  };

  useMount(() => {
    const initGraph = graphInit() as Graph;
    setGraph(initGraph);
    registerCustomCells();

    initGraph?.on("edge:connected", ({ isNew, edge }) => {
      if (isNew) {
        const sourceNode = edge.getSourceNode() as Node;
        edge.setSource(sourceNode);
      }
    });

    initGraph?.on("node:mouseenter", ({ node }) => {
      const nodeName = node.getData().taskName;
      const markup = node.getMarkup() as Markup.JSONMarkup[];
      const fo = markup.filter((m) => m.tagName === "foreignObject")[0];

      node.addTools({
        name: "button",
        args: {
          markup: [
            {
              tagName: "text",
              textContent: nodeName,
              attrs: {
                fill: "#868686",
                "font-size": 16,
                "text-anchor": "center",
              },
            },
          ],
          x: 0,
          y: 0,
          offset: { x: 0, y: fo ? -28 : -10 },
        },
      });
    });

    initGraph?.on("node:mouseleave", ({ node }) => {
      node.removeTool("button");
    });
  });

  return {
    graph,
    paper,
    minimap,
    container,
  };
}

export default {};
