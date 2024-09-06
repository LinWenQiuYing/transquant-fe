import {
  FileOutlined,
  FileTextOutlined,
  FolderOutlined,
  MoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { ResearchModule } from "@transquant/app/components/left/menu/ResearchMenu";
import { useStores as useAppStores } from "@transquant/app/hooks";
import { Markdown } from "@transquant/common";
import { clsPrefix, paths } from "@transquant/constants";
import { ImageInstance } from "@transquant/manage";
import { FactorArgConfig } from "@transquant/space/arg-config";
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
import { GroupProjectItem } from "../../../types";
import FactorModal from "../FactorModal";

interface OperatorMenuProps {
  data: DataType<GroupProjectItem>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const {
    getTeamFactorProjectFileList,
    files,
    getTeamProjectDesc,
    projectMarkdown,
    deleteTeamFactorProject,
    getTags,
    getTeamTags,
    downloadTeamZip,
    getFactorYamlData,
    factorYaml,
    getMemberListByTeam,
    selectedTeam,
    updateFactorYamlData,
  } = useStores().groupFactorStore;
  const { onIframePathChange, getConfigTeamImageInstance, enterIntoTeamEnv } =
    useStores().imageStore;
  const { onLeftMenuSelect } = useAppStores().appStore;

  const [descModalVisible, setDescModalVisible] = useState(false);
  const [factorModalVisible, setFactorModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const navigate = useNavigate();

  const onDelete = () => {
    Modal.confirm({
      title: "是否确认删除该因子项目？",
      content: "该操作将删除项目及项目下所有文件，是否确认删除？",
      onOk: () => {
        deleteTeamFactorProject(data.id);
      },
    });
  };

  const onDownload = () => {
    setModalTitle("新建因子项目");
    setFactorModalVisible(true);
  };

  const treeData = () => {
    return files?.projectFileList.map((item, index) => ({
      title: item.name,
      key: index,
      disabled: item.type === 0,
      icon: item.type === 0 ? <FolderOutlined /> : <FileOutlined />,
      isLeaf: true,
      blockNode: true,
      teamId: files.teamId,
      path: `${files.basePath}/${item.name}`,
    }));
  };
  const jumpToEnv = async (basePath: string, teamId: number) => {
    const images = (await getConfigTeamImageInstance(
      teamId
    )) as ImageInstance[];
    if (!images.length) {
      return message.info("无可用团队环境");
    }

    onIframePathChange("");

    enterIntoTeamEnv(teamId, basePath);

    navigate(`${paths.env}`);
    onLeftMenuSelect(ResearchModule.ResearchEnv);
  };

  const onTreeSelect: TreeSelectProps["onSelect"] = async (keys, info) => {
    const basePath = info.node.path;
    const { teamId } = info.node;

    jumpToEnv(basePath, teamId);
  };

  const onFilesClick = () => {
    getTeamFactorProjectFileList(data.id);
  };

  const onOpen = () => {
    jumpToEnv(projectMarkdown.path, projectMarkdown.teamId!);
  };

  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: "编辑",
      disabled: !getAccess("B040103"),
    },
    {
      key: "save",
      label: "保存",
      disabled: !getAccess("B040104"),
    },
    {
      key: "download",
      label: "下载",
      disabled: !getAccess("B040106"),
    },
    {
      key: "delete",
      label: "删除",
      disabled: !getAccess("B040107"),
    },
  ];

  const actionStyle = {
    color: "#E31430",
    cursor: "pointer",
  };

  const [argVisible, setArgVisible] = useState(false);

  const onItemClick: MenuClickEventHandler = async (info) => {
    switch (info.key) {
      case "edit":
        await getTeamTags();
        await getMemberListByTeam(selectedTeam.id!);
        setModalTitle("编辑因子项目");
        setFactorModalVisible(true);
        break;
      case "delete":
        onDelete();
        break;
      case "save":
        await getTags();
        onDownload();
        break;
      case "download":
        await downloadTeamZip(data.id, data.name);
        break;
      default:
        break;
    }
  };

  const onArgConfigClick = () => {
    getFactorYamlData(data.id);
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
          <Typography.Link onClick={() => onFilesClick()}>
            <UnorderedListOutlined style={actionStyle} />
          </Typography.Link>
        </Popconfirm>
      </Tooltip>
      <Divider type="vertical" />
      <Permission code="B040101" disabled>
        <Tooltip title="因子配置">
          <Typography.Link onClick={onArgConfigClick}>
            <IconFont type="huicepeizhi" />
          </Typography.Link>
        </Tooltip>
      </Permission>
      <Divider type="vertical" />
      <Permission code="B040102" disabled>
        <Tooltip title="描述文档">
          <Typography.Link
            onClick={() => {
              setDescModalVisible(true);
              getTeamProjectDesc(data.id);
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
        onOk={onOpen}
        okButtonProps={{
          disabled: !projectMarkdown.desc,
        }}
        width={1200}
      >
        <Markdown data={projectMarkdown.desc} emptyText="描述文档为空" />
      </Modal>
      {factorModalVisible && (
        <FactorModal<DataType<GroupProjectItem>>
          title={modalTitle}
          data={data}
          visible={factorModalVisible}
          onVisibleChange={(value) => setFactorModalVisible(value)}
        />
      )}
      {argVisible && (
        <FactorArgConfig
          id={data.id}
          propData={factorYaml}
          visible={argVisible}
          onVisibleChange={setArgVisible}
          update={updateFactorYamlData}
        />
      )}
    </Space>
  );
});
