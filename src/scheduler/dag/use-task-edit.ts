import { Graph } from "@antv/x6";
import { cloneDeep, remove } from "lodash-es";
import { useEffect, useState } from "react";
import {
  Coordinate,
  EditWorkflowDefinition,
  NodeData,
  TaskType,
  WorkflowDefinition,
} from "./types";
import { useCellUpdate } from "./use-cell-update";

interface Options {
  graph?: Graph;
  definition?: WorkflowDefinition;
}

export function useTaskEdit(options: Options) {
  const { graph, definition } = options;
  const { addNode, removeNode, setNodeName, setNodeFillColor, setNodeEdge } =
    useCellUpdate({
      graph,
    });

  const [processDefinition, setProcessDefinition] =
    useState<EditWorkflowDefinition>(
      (definition || {
        processDefinition: {},
        processTaskRelationList: [],
        taskDefinitionList: [],
      }) as EditWorkflowDefinition
    );

  const [currTask, setCurrTask] = useState<NodeData>({
    taskType: "SQL",
    code: 0,
    name: "",
  });
  const [taskModalVisible, setTaskModalVisible] = useState(false);

  useEffect(() => {
    if (!definition) return;
    setProcessDefinition(definition);
  }, [definition]);

  function openTaskModal(task: NodeData) {
    setCurrTask(task);
    setTaskModalVisible(true);
  }

  function taskCancel() {
    setTaskModalVisible(false);
    if (!currTask.name) {
      removeNode(String(currTask.code));
      const cloneDeepProcessDefinition = cloneDeep(processDefinition);
      remove(
        cloneDeepProcessDefinition.taskDefinitionList,
        (task) => task.code === currTask.code
      );
      setProcessDefinition(cloneDeepProcessDefinition);
    }
  }

  const appendTask = (code: number, type: TaskType, coordinate: Coordinate) => {
    addNode(`${code}`, type, "", "YES", coordinate);
    const cloneDeepProcessDefinition = cloneDeep(processDefinition);
    cloneDeepProcessDefinition.taskDefinitionList.push({
      code,
      taskType: type,
      name: "",
    });
    setProcessDefinition(cloneDeepProcessDefinition);
    openTaskModal({ code, taskType: type, name: "" });
  };

  /**
   * Edit task
   * @param {number} code
   */
  function editTask(code: number) {
    const definition = processDefinition.taskDefinitionList.find(
      (t) => t.code === +code
    );

    if (definition) {
      setCurrTask(definition);
    }
    // updatePreTasks(getSources(String(code)), code)
    // updatePostTasks(code)
    setTaskModalVisible(true);
  }

  /**
   * Copy a task
   */
  function copyTask(
    name: string,
    code: number,
    targetCode: number,
    type: TaskType,
    flag: string,
    coordinate: Coordinate
  ) {
    addNode(`${code}`, type, name, flag, coordinate);
    const definition = processDefinition.taskDefinitionList.find(
      (t) => t.code === targetCode
    );

    const newDefinition = {
      ...cloneDeep(definition),
      code,
      name,
    } as NodeData;

    const cloneDeepProcessDefinition = cloneDeep(processDefinition);
    cloneDeepProcessDefinition.taskDefinitionList.push(newDefinition);
    setProcessDefinition(cloneDeepProcessDefinition);
  }

  /**
   * Remove task
   * @param {number} codes
   */
  function removeTasks(codes: number[], cells?: any[]) {
    const cloneDeepProcessDefinition = cloneDeep(processDefinition);
    cloneDeepProcessDefinition.taskDefinitionList =
      cloneDeepProcessDefinition.taskDefinitionList.filter(
        (task) => !codes.includes(task.code)
      );
    codes.forEach((code: number) => {
      remove(
        cloneDeepProcessDefinition.processTaskRelationList,
        (process) =>
          process.postTaskCode === code || process.preTaskCode === code
      );
    });
    cells?.forEach((cell) => {
      if (cell.isEdge()) {
        const preTaskCode = cell.getSourceCellId();
        const postTaskCode = cell.getTargetCellId();
        remove(
          cloneDeepProcessDefinition.processTaskRelationList,
          (process) =>
            String(process.postTaskCode) === postTaskCode &&
            String(process.preTaskCode) === preTaskCode
        );
      }
    });
    setProcessDefinition(cloneDeepProcessDefinition);
  }

  function updatePreTasks(preTasks: number[], code: number) {
    if (processDefinition?.processTaskRelationList?.length) {
      const cloneDeepProcessDefinition = cloneDeep(processDefinition);
      remove(
        cloneDeepProcessDefinition.processTaskRelationList,
        (process) => process.postTaskCode === code
      );
      setProcessDefinition(cloneDeepProcessDefinition);
    }
    if (!preTasks?.length) return;
    preTasks.forEach((task) => {
      const cloneDeepProcessDefinition = cloneDeep(processDefinition);
      cloneDeepProcessDefinition?.processTaskRelationList.push({
        postTaskCode: code,
        preTaskCode: task,
        name: "",
        preTaskVersion: 1,
        postTaskVersion: 1,
        conditionType: "NONE",
        conditionParams: {},
      });
      setProcessDefinition(cloneDeepProcessDefinition);
    });
  }

  function taskConfirm({ data }: any) {
    // const taskDef = formatParams(data).taskDefinitionJsonObj as NodeData;
    const taskDef = data;
    // override target config
    const cloneDeepProcessDefinition = cloneDeep(processDefinition);
    cloneDeepProcessDefinition.taskDefinitionList =
      cloneDeepProcessDefinition.taskDefinitionList.map((task) => {
        if (task.code === currTask?.code) {
          setNodeName(`${task.code}`, taskDef.name);
          let fillColor = "#ffffff";
          if (task.flag === "YES") {
            fillColor = "#f3f3f5";
          }
          setNodeFillColor(`${task.code}`, fillColor);

          setNodeEdge(String(task.code), data.preTasks);
          updatePreTasks(data.preTasks, task.code);

          return {
            ...taskDef,
            version: task.version,
            code: task.code,
            taskType: currTask.taskType,
            id: task.id,
          };
        }
        return task;
      });

    setProcessDefinition(cloneDeepProcessDefinition);

    setTaskModalVisible(false);
  }

  return {
    appendTask,
    editTask,
    copyTask,
    removeTasks,
    taskModalVisible,
    taskCancel,
    taskConfirm,
    processDefinition,
    currTask,
  };
}

export default {};
