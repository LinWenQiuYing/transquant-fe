import { Edge, Node } from "@antv/x6";
import { PUBLICURL } from "@transquant/constants";
import { truncateText } from "@transquant/utils";
import { X6_EDGE_NAME, X6_NODE_NAME } from "./dag-config";
import {
  Coordinate,
  TaskExecuteType,
  TaskType,
  WorkflowDefinition,
} from "./types";

export const TASK_TYPES_MAP = {
  JAVA: {
    alias: "JAVA",
  },
  SHELL: {
    alias: "SHELL",
  },
  SUB_PROCESS: {
    alias: "SUB_PROCESS",
  },
  DYNAMIC: {
    alias: "DYNAMIC",
  },
  PROCEDURE: {
    alias: "PROCEDURE",
  },
  SQL: {
    alias: "SQL",
  },
  SPARK: {
    alias: "SPARK",
  },
  FLINK: {
    alias: "FLINK",
  },
  MR: {
    alias: "MapReduce",
    helperLinkDisable: true,
  },
  PYTHON: {
    alias: "PYTHON",
  },
  DEPENDENT: {
    alias: "DEPENDENT",
  },
  HTTP: {
    alias: "HTTP",
  },
  DATAX: {
    alias: "DataX",
  },
  PIGEON: {
    alias: "PIGEON",
  },
  SQOOP: {
    alias: "SQOOP",
    helperLinkDisable: true,
  },
  CONDITIONS: {
    alias: "CONDITIONS",
  },
  DATA_QUALITY: {
    alias: "DATA_QUALITY",
    helperLinkDisable: true,
  },
  SWITCH: {
    alias: "SWITCH",
  },
  SEATUNNEL: {
    alias: "SeaTunnel",
    helperLinkDisable: true,
  },
  EMR: {
    alias: "AmazonEMR",
    helperLinkDisable: true,
  },
  ZEPPELIN: {
    alias: "ZEPPELIN",
    helperLinkDisable: true,
  },
  JUPYTER: {
    alias: "JUPYTER",
    helperLinkDisable: true,
  },
  K8S: {
    alias: "K8S",
    helperLinkDisable: true,
  },
  MLFLOW: {
    alias: "MLFLOW",
    helperLinkDisable: true,
  },
  OPENMLDB: {
    alias: "OPENMLDB",
    helperLinkDisable: true,
  },
  DVC: {
    alias: "DVC",
    helperLinkDisable: true,
  },
  DINKY: {
    alias: "DINKY",
    helperLinkDisable: true,
  },
  SAGEMAKER: {
    alias: "SageMaker",
    helperLinkDisable: true,
  },
  CHUNJUN: {
    alias: "CHUNJUN",
    helperLinkDisable: true,
  },
  FLINK_STREAM: {
    alias: "FLINK_STREAM",
    helperLinkDisable: true,
    taskExecuteType: "STREAM",
  },
  PYTORCH: {
    alias: "Pytorch",
    helperLinkDisable: true,
  },
  HIVECLI: {
    alias: "HIVECLI",
    helperLinkDisable: true,
  },
  DMS: {
    alias: "DMS",
    helperLinkDisable: true,
  },
  DATASYNC: {
    alias: "DATASYNC",
    helperLinkDisable: true,
  },
  KUBEFLOW: {
    alias: "KUBEFLOW",
    helperLinkDisable: true,
  },
  LINKIS: {
    alias: "LINKIS",
    helperLinkDisable: true,
  },
  DATA_FACTORY: {
    alias: "DATA_FACTORY",
    helperLinkDisable: true,
  },
  REMOTESHELL: {
    alias: "REMOTESHELL",
    helperLinkDisable: true,
  },
} as {
  [key in TaskType]: {
    alias: string;
    helperLinkDisable?: boolean;
    taskExecuteType?: TaskExecuteType;
  };
};

export function useCustomCellBuilder() {
  function buildNode(
    id: string,
    type: TaskType,
    taskName: string,
    flag: string,
    coordinate: Coordinate = { x: 100, y: 100 }
  ): Node.Metadata {
    const truncation = taskName ? truncateText(taskName, 18) : id;
    return {
      id,
      shape: X6_NODE_NAME,
      x: coordinate.x,
      y: coordinate.y,
      data: {
        taskType: type,
        taskName: taskName || id,
        flag,
        taskExecuteType: "STREAM",
      },
      attrs: {
        image: {
          // Use href instead of xlink:href, you may lose the icon when downloadPNG
          "xlink:href": `${PUBLICURL}/images/task-icons/${type.toLocaleLowerCase()}.png`,
        },
        title: {
          text: truncation,
        },
        rect: {
          fill: flag === "NO" ? "#f3f3f5" : "#ffffff",
        },
      },
    };
  }

  function buildEdge(
    sourceId: string,
    targetId: string,
    label = "",
    isStream = false
  ): Edge.Metadata {
    return {
      shape: X6_EDGE_NAME,
      source: {
        cell: sourceId,
      },
      target: {
        cell: targetId,
      },
      labels: label ? [label] : undefined,
      attrs: {
        line: {
          strokeDasharray: isStream ? "5 5" : "none",
        },
      },
    };
  }

  function parseLocationStr(locationStr: string) {
    let locations = null;
    if (!locationStr) return locations;
    locations = JSON.parse(locationStr);
    return Array.isArray(locations) ? locations : null;
  }

  function buildGraph(definition: WorkflowDefinition) {
    const nodes: Node.Metadata[] = [];
    const edges: Edge.Metadata[] = [];

    const locations =
      parseLocationStr(definition.processDefinition.locations) || [];
    const tasks = definition.taskDefinitionList;
    const connects = definition.processTaskRelationList;
    const taskTypeMap = {} as { [key in string]: TaskType };

    tasks.forEach((task) => {
      const location = locations.find((l) => l.taskCode === task.code) || {};
      const node = buildNode(
        `${task.code}`,
        task.taskType,
        task.name,
        task.flag,
        {
          x: location.x,
          y: location.y,
        }
      );
      nodes.push(node);
      taskTypeMap[String(task.code)] = task.taskType;
    });

    connects
      .filter((r) => !!r.preTaskCode)
      .forEach((c) => {
        const isStream =
          TASK_TYPES_MAP[taskTypeMap[c.preTaskCode]].taskExecuteType ===
            "STREAM" ||
          TASK_TYPES_MAP[taskTypeMap[c.postTaskCode]].taskExecuteType ===
            "STREAM";
        const edge = buildEdge(
          `${c.preTaskCode}`,
          `${c.postTaskCode}`,
          c.name,
          isStream
        );
        edges.push(edge);
      });
    return {
      nodes,
      edges,
    };
  }

  return {
    buildNode,
    buildEdge,
    buildGraph,
  };
}

export default {};
