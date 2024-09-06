import type { Edge, Node } from "@antv/x6";
import { get } from "lodash";
import { Connect, Location, TaskDefinition } from "./types";

/**
 * Handling business entity and x6 entity conversion
 * @param {Options} options
 */
export function useBusinessMapper() {
  /**
   * Get connects, connects and processTaskRelationList are the same
   * @param {Node[]} nodes
   * @param {Edge[]} edges
   * @param {TaskDefinition[]} taskDefinitions
   * @returns {Connect[]}
   */
  function getConnects(
    nodes: Node[],
    edges: Edge[],
    taskDefinitions: TaskDefinition[]
  ): Connect[] {
    interface TailNodes {
      [code: string]: boolean;
    }
    // Nodes in DAG whose in-degree is not 0
    const tailNodes: TailNodes = {};
    // If there is an edge target to a node, the node is tailNode
    edges.forEach((edge) => {
      const targetId = edge.getTargetCellId();
      tailNodes[targetId] = true;
    });
    const isHeadNode = (code: string) => !tailNodes[code];

    interface TasksMap {
      [code: string]: TaskDefinition;
    }
    const tasksMap: TasksMap = {};
    nodes.forEach((node) => {
      const code = node.id;
      const task = taskDefinitions.find((t) => t.code === Number(code));
      if (task) {
        tasksMap[code] = task;
      }
    });

    const headConnects: Connect[] = nodes
      .filter((node) => isHeadNode(node.id))
      .map((node) => {
        const task = tasksMap[node.id];
        return {
          name: "",
          preTaskCode: 0,
          preTaskVersion: 0,
          postTaskCode: task?.code,
          postTaskVersion: task?.version || 0,
          // conditionType and conditionParams are reserved
          conditionType: "NONE",
          conditionParams: {},
        };
      });

    const tailConnects: Connect[] = edges.map((edge) => {
      const labels = edge.getLabels();
      const labelName = get(labels, ["0", "attrs", "label", "text"], "");
      const sourceId = edge.getSourceCellId();
      const prevTask = tasksMap[sourceId];
      const targetId = edge.getTargetCellId();
      const task = tasksMap[targetId];

      return {
        name: labelName,
        preTaskCode: prevTask.code,
        preTaskVersion: prevTask.version || 0,
        postTaskCode: task.code,
        postTaskVersion: task.version || 0,
        // conditionType and conditionParams are reserved
        conditionType: "NONE",
        conditionParams: {},
      };
    });

    return headConnects.concat(tailConnects);
  }

  function getLocations(nodes: Node[]): Location[] {
    return nodes.map((node) => {
      const code = +node.id;
      const { x, y } = node.getPosition();
      return {
        taskCode: code,
        x,
        y,
      };
    });
  }

  return {
    getLocations,
    getConnects,
  };
}

export default {};
