import { Cell } from "@antv/x6";
import { UUID } from "@transquant/utils";
import { useMount } from "ahooks";
import { Typography } from "antd";
import { useContext } from "react";
import { DagContext } from "./dag-context";
import { Coordinate, TaskType } from "./types";
import { useCellActive } from "./use-cell-active";
import { genTaskCodeList } from "./use-dag-drag-drop";

const LEFT_DISTANCE = 880;
const TOP_DISTANCE = 80;

interface DagContextMenuProps {
  startDisplay: boolean;
  executeTaskDisplay: boolean;
  menuDisplay: boolean;
  taskInstance: undefined;
  cell: Cell;
  visible: boolean;
  left: number;
  top: number;
  onHide: Function;
  onStart: Function;
  onEdit: Function;
  onCopyTask: (
    name: string,
    code: number,
    targetCode: number,
    type: TaskType,
    flag: string,
    coordinate: Coordinate
  ) => void;
  onRemoveTasks: (codes: number[], cells?: any[]) => void;
  onViewLog: Function;
  onExecuteTask: Function;
  onRemoveTaskInstanceCache: Function;
}

export default function DagContextMenu(props: DagContextMenuProps) {
  const {
    menuDisplay,
    visible,
    left,
    top,
    onEdit,
    cell,
    onHide,
    onRemoveTasks,
    onCopyTask,
  } = props;
  const { graph } = useContext(DagContext);

  useCellActive({ graph });

  useMount(() => {
    document.addEventListener("click", () => {
      onHide();
    });
  });

  const handleCopy = () => {
    // const genNums = 1;
    const type = cell.data.taskType;
    const taskName = `${cell.data.taskName}_${UUID()}`;
    const targetCode = Number(cell.id);
    const { flag } = cell.data;
    const genNums = 1;
    genTaskCodeList(genNums, 10086).then((res) => {
      const [code] = res;
      onCopyTask(taskName, code, targetCode, type, flag, {
        x: left - LEFT_DISTANCE,
        y: top - TOP_DISTANCE,
      });
    });
  };

  const handleDelete = () => {
    graph?.removeCell(cell);
    onRemoveTasks([Number(cell.id)]);
  };

  return (
    visible && (
      <div
        className="fixed left-0 top-0 w-[100px] bg-white shadow"
        style={{ left: `${left}px`, top: `${top}px` }}
      >
        {menuDisplay && (
          <>
            <Typography.Link
              className="block w-full leading-8 text-center"
              onClick={() => onEdit(cell.id)}
            >
              编辑
            </Typography.Link>
            <Typography.Link
              className="block w-full leading-8 text-center"
              onClick={handleCopy}
            >
              复制节点
            </Typography.Link>
            <Typography.Link
              className="block w-full leading-8 text-center"
              onClick={handleDelete}
            >
              删除
            </Typography.Link>
          </>
        )}
      </div>
    )
  );
}
