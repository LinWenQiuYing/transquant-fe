import { IconFont } from "@transquant/ui";
import { Button, Tooltip, Typography } from "antd";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DagContext } from "./dag-context";
import { WorkflowDefinition } from "./types";

interface ToolbarProps {
  readonly: boolean;
  definition?: WorkflowDefinition;
  onRemoveTasks: (codes: number[], cells?: any[]) => void;
  onSaveModelToggle: (value: boolean) => void;
  onVersionModelToggle: (value: boolean) => void;
}

export default function Toolbar(props: ToolbarProps) {
  const {
    onRemoveTasks,
    onSaveModelToggle,
    readonly,
    onVersionModelToggle,
    definition,
  } = props;
  const { graph } = useContext(DagContext);
  const navigation = useNavigate();

  const removeCells = () => {
    if (graph) {
      const cells = graph.getSelectedCells();
      if (cells) {
        const codes = cells
          .filter((cell) => cell.isNode())
          .map((cell) => +cell.id);
        onRemoveTasks(codes, cells);
        graph.removeCells(cells);
      }
    }
  };

  const onClose = () => {
    if (history.state.back !== "/login") {
      navigation(-1);
    }
  };

  return (
    <div className="flex items-center justify-between px-3 mb-5 border-gray-200">
      {!definition ? (
        <div>创建工作流</div>
      ) : (
        <div>{definition.processDefinition.name}</div>
      )}
      <div className="flex items-center justify-around gap-4">
        <Tooltip title="删除">
          <Typography.Link
            onClick={() => removeCells()}
            className="w-8 h-8 p-1 text-center text-red-600 bg-red-200 rounded-full"
          >
            <IconFont type="shanchu" />
          </Typography.Link>
        </Tooltip>
        <Tooltip title="版本信息">
          <Typography.Link
            onClick={() => onVersionModelToggle(true)}
            className="w-8 h-8 p-1 text-center text-red-600 bg-red-200 rounded-full"
          >
            <IconFont type="banbenxinxi" />
          </Typography.Link>
        </Tooltip>

        <Button onClick={() => onClose()}>关闭</Button>
        <Button
          type="primary"
          disabled={readonly}
          onClick={() => onSaveModelToggle(true)}
        >
          保存
        </Button>
      </div>
    </div>
  );
}
