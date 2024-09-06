import { Collapse, CollapseProps } from "antd";
import { SyntheticEvent } from "react";
import "./sidebar.less";
import { TaskType } from "./types";

const variables = {
  universal: [
    {
      taskCategory: "Universal",
      taskType: "SQL",
    },
    {
      taskCategory: "Universal",
      taskType: "DATAX",
    },
    {
      taskCategory: "Universal",
      taskType: "PYTHON",
    },
  ],
};

interface SidebarProps {
  onDragStart: (e: SyntheticEvent<HTMLDivElement>, type: TaskType) => void;
}

export default function Sidebar(props: SidebarProps) {
  const { onDragStart } = props;
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "通用组件",
      children: variables.universal.map((task) => (
        <div
          draggable="true"
          key={task.taskType}
          onDragStart={(e) => onDragStart(e, task.taskType as TaskType)}
          className="draggable w-full h-8 items-center px-2.5 py-0 mb-2 rounded cursor-move border border-solid border-gray-300 flex"
        >
          <em
            className={`block w-4 h-4 mr-3 bg-contain sidebar-icon icon-${task.taskType.toLocaleLowerCase()}`}
          />
          <span>{task.taskType === "DATAX" ? "ETL" : task.taskType}</span>
        </div>
      )),
    },
  ];
  return (
    <div className="h-full mr-4 w-60">
      <Collapse ghost defaultActiveKey={["1"]} items={items} />
    </div>
  );
}
