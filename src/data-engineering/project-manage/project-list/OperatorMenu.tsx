import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { IconFont, Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Divider, message, Modal, Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { ProjectListItem } from "../../types";
import EmpowerModal from "./EmpowerModal";
import ProjectModal from "./ProjectModal";

interface OperatorMenuProps {
  data: DataType<ProjectListItem>;
  fromManage: boolean;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data, fromManage } = props;
  const { deleteProject, getProjectList, getUsers } =
    useStores().projectManageStore;
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const onDelete = () => {
    Modal.confirm({
      title: "是否确认删除该项目？",
      content: "该操作将删除该项目，是否确认删除？",
      onOk: async () => {
        await deleteProject(data.code)
          .then(() => {
            getProjectList();
            message.success("删除成功");
          })
          .catch(() => {});
      },
    });
  };

  const handleEdit = async () => {
    setModalTitle("编辑项目");
    if (data.desc === "--") {
      data.desc = "";
    }
    setProjectModalVisible(true);
  };

  const [empowerVisible, setEmpowerVisible] = useState(false);

  const onEmpower = () => {
    getUsers();
    setEmpowerVisible(true);
  };

  return (
    <Space>
      {fromManage && (
        <Permission code="B200201" disabled>
          <Tooltip title="项目授权">
            <Typography.Link onClick={onEmpower}>
              <IconFont type="shujuyuanshouquan" />
            </Typography.Link>
          </Tooltip>
        </Permission>
      )}
      {!fromManage && (
        <>
          <Permission code="B100102" disabled>
            <Tooltip title="编辑">
              <Typography.Link onClick={handleEdit}>
                <EditOutlined />
              </Typography.Link>
            </Tooltip>
          </Permission>
          <Divider type="vertical" />
          <Permission code="B100103" disabled>
            <Tooltip title="删除">
              <Typography.Link onClick={onDelete}>
                <DeleteOutlined />
              </Typography.Link>
            </Tooltip>
          </Permission>
        </>
      )}
      {projectModalVisible && (
        <ProjectModal<DataType<ProjectListItem>>
          title={modalTitle}
          data={data}
          visible={projectModalVisible}
          onVisibleChange={(value) => setProjectModalVisible(value)}
        />
      )}
      {empowerVisible && (
        <EmpowerModal
          projectId={data.id}
          visible={empowerVisible}
          onVisibleChange={setEmpowerVisible}
        />
      )}
    </Space>
  );
});
