import {
  FileOutlined,
  FileTextOutlined,
  FolderOutlined,
  MoreOutlined,
  ProfileOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { ResearchModule } from "@transquant/app/components/left/menu/ResearchMenu";
import { useStores as useAppStores } from "@transquant/app/hooks";
import { Markdown } from "@transquant/common";
import { clsPrefix, paths } from "@transquant/constants";
import { ImageInstance } from "@transquant/manage";
import { StrategyArgConfig } from "@transquant/space/arg-config";
import { getAccess, IconFont, Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import {
  Divider,
  Dropdown,
  MenuProps,
  message,
  Modal,
  Popconfirm,
  Space,
  Tooltip,
  Tree,
  TreeSelectProps,
  Typography,
} from "antd";
import { observer } from "mobx-react";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStores } from "../../../hooks";
import PublishModal from "../../../publish";
import { ProjectItem } from "../../../types";
import StrategyModal from "../StrategyModal";

interface OperatorMenuProps {
  data: DataType<ProjectItem>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const {
    getStrategyProjectFileList,
    files,
    getProjectDesc,
    projectMarkdown,
    deleteStrategyProject,
    getTags,
    getStrategyYamlData,
    strategyYaml,
    updateStrategyYamlData,
  } = useStores().strategyResearchStore;
  const { downloadZip } = useStores().factorResearchStore;
  const { getPersonalImageInstances, enterIntoPrivateEnv } =
    useStores().imageStore;
  const { onLeftMenuSelect } = useAppStores().appStore;
  const { getBelongTeamInfos } = useStores().publishStore;

  const [descModalVisible, setDescModalVisible] = useState(false);
  const [factorModalVisible, setFactorModalVisible] = useState(false);
  const [publishVisible, setPublishVisible] = useState(false);
  const [argVisible, setArgVisible] = useState(false);

  const navigate = useNavigate();

  const onDelete = () => {
    Modal.confirm({
      title: "是否确认删除该策略项目？",
      content: "该操作将删除项目及项目下所有文件，是否确认删除？",
      onOk: () => {
        deleteStrategyProject(data.id);
      },
    });
  };

  const treeData = () => {
    return files?.projectFileList.map((item, index) => ({
      title: item.name,
      key: index,
      disabled: item.type === 0,
      icon: item.type === 0 ? <FolderOutlined /> : <FileOutlined />,
      isLeaf: true,
      blockNode: true,
      path: `${files.basePath}/${item.name}`,
    }));
  };

  const jumpToEnv = async (basePath: string) => {
    const image = (await getPersonalImageInstances()) as ImageInstance;

    if (!image) {
      return message.info("无可用个人环境");
    }
    enterIntoPrivateEnv(basePath);

    navigate(`${paths.env}`);
    onLeftMenuSelect(ResearchModule.ResearchEnv);
  };

  const onTreeSelect: TreeSelectProps["onSelect"] = async (key, info) => {
    const basePath = info.node.path;
    jumpToEnv(basePath);
  };

  const onFilesClick = (data: DataType<ProjectItem>) => {
    getStrategyProjectFileList(data.id);
  };

  const onOpen = () => {
    jumpToEnv(projectMarkdown.path);
  };

  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: "编辑",
      disabled: !getAccess("B030205"),
    },
    {
      key: "download",
      label: "下载",
      disabled: !getAccess("B030207"),
    },
    {
      key: "delete",
      label: "删除",
      disabled: !getAccess("B030208"),
    },
  ];

  const onItemClick: MenuClickEventHandler = async (info) => {
    switch (info.key) {
      case "edit":
        await getTags();
        setFactorModalVisible(true);
        break;
      case "download":
        await downloadZip(data.id, data.name);
        break;
      case "delete":
        onDelete();
        break;
      default:
        break;
    }
  };

  const onPublish = async () => {
    await getBelongTeamInfos();
    setPublishVisible(true);
  };

  const onArgConfigClick = () => {
    getStrategyYamlData(data.id);
    setArgVisible(true);
  };

  return (
    <Space>
      <Tooltip title="文件列表">
        <Popconfirm
          title={
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
              <span>文件列表</span>
            </Space>
          }
          icon={null}
          showCancel={false}
          rootClassName={`${clsPrefix}-project-files-confirm`}
          description={
            <Tree.DirectoryTree treeData={treeData()} onSelect={onTreeSelect} />
          }
        >
          <Typography.Link onClick={() => onFilesClick(data)}>
            <ProfileOutlined />
          </Typography.Link>
        </Popconfirm>
      </Tooltip>
      <Divider type="vertical" />
      <Permission code="B030202" disabled>
        <Tooltip title="回测配置">
          <Typography.Link onClick={onArgConfigClick}>
            <IconFont type="huicepeizhi" />
          </Typography.Link>
        </Tooltip>
      </Permission>
      <Divider type="vertical" />
      <Permission code="B030203" disabled>
        <Tooltip
          title={
            data.canSubmit
              ? "发布"
              : "无策略评价结果，请先运行evaluator并进行regist/show操作"
          }
        >
          <Typography.Link onClick={onPublish} disabled={!data.canSubmit}>
            <RocketOutlined />
          </Typography.Link>
        </Tooltip>
      </Permission>

      <Divider type="vertical" />
      <Permission code="B030204" disabled>
        <Tooltip title="描述文档">
          <Typography.Link
            onClick={() => {
              setDescModalVisible(true);
              getProjectDesc(data.id);
            }}
          >
            <FileTextOutlined />
          </Typography.Link>
        </Tooltip>
      </Permission>
      <Divider type="vertical" />
      <Tooltip title="更多">
        <Dropdown menu={{ items, onClick: onItemClick }}>
          <Typography.Link>
            <MoreOutlined style={{ rotate: "90deg" }} />
          </Typography.Link>
        </Dropdown>
      </Tooltip>
      <Modal
        title="描述文档"
        open={descModalVisible}
        onCancel={() => setDescModalVisible(false)}
        okText="打开"
        okButtonProps={{ disabled: !projectMarkdown.desc }}
        onOk={onOpen}
      >
        <Markdown data={projectMarkdown.desc} emptyText="描述文档为空" />
      </Modal>
      <StrategyModal<DataType<ProjectItem>>
        title="编辑策略项目"
        data={data}
        visible={factorModalVisible}
        onVisibleChange={(value) => setFactorModalVisible(value)}
      />
      {publishVisible && (
        <PublishModal
          title="发布策略项目"
          type={1}
          projectId={data.id}
          visible={publishVisible}
          onVisibleChange={(value) => setPublishVisible(value)}
        />
      )}
      {argVisible && (
        <StrategyArgConfig
          id={data.id}
          propData={strategyYaml}
          visible={argVisible}
          onVisibleChange={setArgVisible}
          update={updateStrategyYamlData}
        />
      )}
    </Space>
  );
});
