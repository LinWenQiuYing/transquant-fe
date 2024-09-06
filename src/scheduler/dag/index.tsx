import { Cell, Graph } from "@antv/x6";
import { message } from "antd";
import { useEffect, useState } from "react";
import TaskModal from "../task-modal";
import Canvas from "./Canvas";
import { DagContext } from "./dag-context";
import DagContextMenu from "./dag-context-menu";
import DagSaveModal from "./dag-save-modal";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import {
  Connect,
  ITaskData,
  Location,
  SaveForm,
  TaskDefinition,
  WorkflowDefinition,
} from "./types";
import { useBusinessMapper } from "./use-business-mapper";
import { useDagDrapAndDrop } from "./use-dag-drag-drop";
import { useGraphBackfill } from "./use-graph-backfill";
import { useNodeMenu } from "./use-node-menu";
import { useTaskEdit } from "./use-task-edit";
import VersionModal from "./version-modal";

export interface SaveData {
  saveForm: SaveForm;
  taskDefinitions: TaskDefinition[];
  connects: Connect[];
  locations: Location[];
}

interface DagProps {
  projectCode: number;
  code?: number;
  readonly?: boolean;
  definition?: WorkflowDefinition;
  onRefresh?: () => void;
  onSave: (data: SaveData) => void;
}

export default function Dag(props: DagProps) {
  const {
    readonly: propReadonly,
    definition,
    onSave,
    projectCode,
    code,
    onRefresh,
  } = props;
  const [graph, setGraph] = useState<Graph>();
  const [versionVisible, setVersionVisible] = useState(false);
  const [readonly, setReadonly] = useState<boolean>(false);

  useEffect(() => {
    if (!propReadonly) return;
    setReadonly(propReadonly);
  }, [propReadonly]);
  const context = { graph, setGraph, readonly, setReadonly };

  const {
    appendTask,
    editTask,
    copyTask,
    removeTasks,
    taskModalVisible,
    taskCancel,
    taskConfirm,
    processDefinition,
    currTask,
  } = useTaskEdit({
    graph,
    definition,
  });

  const { onDrop, onDragStart } = useDagDrapAndDrop({ ...context, appendTask });
  // Right click cell
  const { nodeVariables, menuHide, menuStart } = useNodeMenu({
    graph,
  });

  useGraphBackfill({ graph, definition });

  const taskInstance = () => {
    if (nodeVariables.menuCell) {
      // const taskCode = Number(nodeVariables.menuCell!.id);
      return undefined;
    }
    return undefined;
  };

  const handleViewLog = (taskId: number, taskType: string) => {
    // eslint-disable-next-line no-console
    console.log(taskId, taskType);
  };

  const handleExecuteTask = (startNodeList: number, taskDependType: string) => {
    // eslint-disable-next-line no-console
    console.log(startNodeList, taskDependType);
  };

  const handleRemoveTaskInstanceCache = (taskId: number) => {
    // eslint-disable-next-line no-console
    console.log(taskId);
  };

  const [saveModalShow, setSaveModalShow] = useState(false);

  // const navigate = useNavigate();

  const saveModelToggle = (bool: boolean) => {
    setSaveModalShow(bool);
  };

  const { getConnects, getLocations } = useBusinessMapper();

  const onSubmit = (saveForm: any) => {
    const edges = graph?.getEdges() || [];
    const nodes = graph?.getNodes() || [];
    if (!nodes.length) {
      message.error("未创建节点保存失败");
      setSaveModalShow(false);
      return;
    }
    const connects = getConnects(
      nodes,
      edges,
      processDefinition.taskDefinitionList as any
    );
    const locations = getLocations(nodes);

    const params: SaveData = {
      taskDefinitions: processDefinition.taskDefinitionList as TaskDefinition[],
      saveForm,
      connects,
      locations,
    };
    onSave(params);

    saveModelToggle(false);
  };

  return (
    <DagContext.Provider value={context}>
      <div className="flex flex-col h-full">
        <Toolbar
          definition={definition}
          readonly={readonly}
          onRemoveTasks={removeTasks}
          onSaveModelToggle={saveModelToggle}
          onVersionModelToggle={setVersionVisible}
        />
        <div className="flex flex-row flex-1">
          <Sidebar onDragStart={onDragStart} />
          <Canvas onDrop={onDrop} />
        </div>
        <DagContextMenu
          startDisplay={false}
          executeTaskDisplay={false}
          menuDisplay={!readonly}
          taskInstance={taskInstance()}
          cell={nodeVariables.menuCell as Cell}
          visible={nodeVariables.menuVisible}
          left={nodeVariables.pageX}
          top={nodeVariables.pageY}
          onHide={menuHide}
          onStart={menuStart}
          onEdit={editTask}
          onCopyTask={copyTask}
          onRemoveTasks={removeTasks}
          onViewLog={handleViewLog}
          onExecuteTask={handleExecuteTask}
          onRemoveTaskInstanceCache={handleRemoveTaskInstanceCache}
        />
        {taskModalVisible && (
          <TaskModal
            readonly={readonly}
            visible={taskModalVisible}
            projectCode={projectCode}
            onCancel={taskCancel}
            onSubmit={taskConfirm}
            definition={processDefinition}
            data={currTask as ITaskData}
          />
        )}
        {saveModalShow && (
          <DagSaveModal
            visible={saveModalShow}
            onSubmit={onSubmit}
            definition={definition}
            onCancel={() => saveModelToggle(false)}
          />
        )}
        {versionVisible && code && (
          <VersionModal
            visible={versionVisible}
            onVisibleChange={setVersionVisible}
            projectCode={projectCode}
            code={code}
            onRefresh={onRefresh}
            row={
              (definition as unknown as WorkflowDefinition)?.processDefinition
            }
          />
        )}
      </div>
    </DagContext.Provider>
  );
}
