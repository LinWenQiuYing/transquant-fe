import { clsPrefix, paths } from "@transquant/constants";
import Scheduler from "@transquant/scheduler";
import { IconFont } from "@transquant/ui";
import { useUnmount } from "ahooks";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { observer } from "mobx-react";
import { useNavigate, useParams } from "react-router-dom";
import { useStores } from "../../hooks";
import JobDefinition from "../job-definition";
import JobInstance from "../job-instance";
import ProjectView from "../project-view";
import WorkflowDefine from "../workflow-define";
import WorkflowInstance from "../workflow-instance";
import WorkflowTime from "../workflow-time";
import "./index.less";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export default observer(function ProjectDetail() {
  const { projectInfo, selectedKey, onSelectedKeysChange } =
    useStores().projectManageStore;
  const navigate = useNavigate();
  const params = useParams();

  useUnmount(() => {
    onSelectedKeysChange(["preview"]);
  });

  const onClick: MenuProps["onClick"] = (e) => {
    onSelectedKeysChange([e.key]);
    if (!projectInfo) return;

    navigate(`${paths.projectManage}/${projectInfo.code}/${e.key}`);
  };

  const items: MenuItem[] = [
    getItem("项目概览", "preview", <IconFont type="xiangmugailan" />),

    getItem("工作流", "workflow", <IconFont type="gongzuoliu" />, [
      getItem("工作流定义", "workflow-define"),
      getItem("工作流实例", "workflow-instance"),
      getItem("工作流定时", "workflow-time"),
    ]),

    getItem("任务", "job", <IconFont type="renwu" />, [
      getItem("任务定义", "job-definition"),
      getItem("任务实例", "job-instance"),
    ]),
  ];

  return (
    <div className={`${clsPrefix}-project-detail`}>
      <div className={`${clsPrefix}-project-detail-menu`}>
        <div className={`${clsPrefix}-project-detail-menu-title`}>
          {projectInfo?.name}
        </div>
        <Menu
          selectedKeys={[selectedKey]}
          defaultSelectedKeys={["preview"]}
          defaultOpenKeys={["workflow", "job"]}
          mode="inline"
          items={items}
          onClick={onClick}
        />
      </div>
      <div className={`${clsPrefix}-project-detail-content`}>
        {selectedKey === "preview" && <ProjectView />}
        {selectedKey === "workflow-define" ? (
          params?.action ? (
            <Scheduler />
          ) : (
            <WorkflowDefine />
          )
        ) : null}
        {selectedKey === "workflow-instance" ? (
          params?.action ? (
            <Scheduler />
          ) : (
            <WorkflowInstance />
          )
        ) : null}
        {selectedKey === "workflow-time" && <WorkflowTime />}
        {selectedKey === "job-definition" && <JobDefinition />}
        {selectedKey === "job-instance" && <JobInstance /> ? (
          params?.action ? (
            <Scheduler />
          ) : (
            <JobInstance />
          )
        ) : null}
      </div>
    </div>
  );
});
