import { Cell, Edge, Graph, Node } from "@antv/x6";
import { PUBLICURL } from "@transquant/constants";
import _ from "lodash-es";
import { useEffect, useRef } from "react";
import {
  EDGE,
  EDGE_HOVER,
  EDGE_SELECTED,
  NODE,
  NODE_HOVER,
  NODE_SELECTED,
  PORT,
  PORT_HOVER,
  PORT_SELECTED,
  X6_PORT_OUT_NAME,
} from "./dag-config";

interface Options {
  graph?: Graph;
}

export function useCellActive(options: Options) {
  const { graph } = options;
  const hoverCell = useRef<Cell<Cell.Properties>>();

  const isStatusIcon = (tagName: string) => {
    if (!tagName) return false;
    return (
      tagName.toLocaleLowerCase() === "em" ||
      tagName.toLocaleLowerCase() === "body"
    );
  };

  function setEdgeStyle(edge: Edge) {
    const isHover = edge === hoverCell.current;
    const isSelected = graph?.isSelected(edge);
    // TODO
    // const labelName = this.getEdgeLabelName ? this.getEdgeLabelName(edge) : ''
    let edgeProps = null;

    if (isHover) {
      edgeProps = _.merge(_.cloneDeep(EDGE), EDGE_HOVER);
    } else if (isSelected) {
      edgeProps = _.merge(_.cloneDeep(EDGE), EDGE_SELECTED);
    } else {
      edgeProps = _.cloneDeep(EDGE);
    }

    edge.setAttrs(edgeProps.attrs);
    edge.setLabels([
      {
        ..._.merge({
          attrs: _.cloneDeep(edgeProps.defaultLabel.attrs),
        }),
      },
    ]);
  }

  function setNodeStyle(node: Node) {
    const isHover = node === hoverCell.current;
    const isSelected = graph?.isSelected(node);
    const portHover = _.cloneDeep(PORT_HOVER.groups[X6_PORT_OUT_NAME].attrs);
    const portSelected = _.cloneDeep(
      PORT_SELECTED.groups[X6_PORT_OUT_NAME].attrs
    );
    const portDefault = _.cloneDeep(PORT.groups[X6_PORT_OUT_NAME].attrs);
    const nodeHover = _.merge(_.cloneDeep(NODE.attrs), NODE_HOVER.attrs);
    const nodeSelected = _.merge(_.cloneDeep(NODE.attrs), NODE_SELECTED.attrs);

    let img = null;
    let nodeAttrs = null;
    let portAttrs = null;

    if (isHover || isSelected) {
      img = `${PUBLICURL}/images/task-icons/${node.data.taskType.toLocaleLowerCase()}_hover.png`;
      if (isHover) {
        nodeAttrs = nodeHover;
        portAttrs = _.merge(portDefault, portHover);
      } else {
        nodeAttrs = nodeSelected;
        portAttrs = _.merge(portDefault, portSelected);
      }
    } else {
      img = `${PUBLICURL}/images/task-icons/${node.data.taskType.toLocaleLowerCase()}.png`;
      nodeAttrs = NODE.attrs;
      portAttrs = portDefault;
    }
    node.setAttrByPath("image/xlink:href", img);
    node.setAttrs(nodeAttrs);
    node.setPortProp(X6_PORT_OUT_NAME, "attrs", portAttrs);
  }

  function updateCellStyle(cell: Cell) {
    if (cell.isEdge()) {
      setEdgeStyle(cell);
    } else if (cell.isNode()) {
      setNodeStyle(cell);
    }
  }

  useEffect(() => {
    if (!graph) return;

    // hover
    graph.on("cell:mouseenter", (data) => {
      const { cell, e } = data;

      if (!isStatusIcon(e.target.tagName)) {
        hoverCell.current = cell;
        updateCellStyle(cell);
      }
    });
    graph.on("cell:mouseleave", ({ cell }) => {
      hoverCell.current = undefined;
      updateCellStyle(cell);
    });

    // select
    graph.on("cell:selected", ({ cell }) => {
      updateCellStyle(cell);
    });
    graph.on("cell:unselected", ({ cell }) => {
      updateCellStyle(cell);
    });
  }, [graph]);

  return {
    hoverCell,
  };
}

export default {};
