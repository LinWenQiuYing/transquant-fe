import { PlusOutlined } from "@ant-design/icons";
import { IconFont, Permission } from "@transquant/ui";
import { DataType, useDataSource } from "@transquant/utils";
import { useMount } from "ahooks";
import { Button, Modal, Table, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../../hooks";
import { ShareItem, SimpleUser } from "../../../types";
import ShareModal from "./ShareModal";

export const SpaceStatus = {
  0: "未启动",
  1: "启动中",
  2: "固化中",
  3: "升级中",
  4: "销毁中",
  5: "重启中",
  6: "运行中",
  7: "资源申请中",
};

export default observer(function ShareList() {
  const {
    shareList,
    shareListLoading,
    deleteShareSpace,
    getShareSpace,
    selectedGroup,
    getMemberListByTeam,
    getAllImageList,
    getEnvTemplates,
    getFactorStrategySysTemplate,
  } = useStores().organizationStore;

  useMount(() => {
    getShareSpace(selectedGroup!.id);
  });

  const onDelete = (record: ShareItem) => () => {
    Modal.confirm({
      title: "是否确定删除该协作空间？",
      content:
        "删除后将删除该协作空间的所有代码，并且无法恢复，请确认是否继续？",
      onOk() {
        deleteShareSpace(record.id);
      },
    });
  };

  const columns: ColumnsType<DataType<ShareItem>> = [
    {
      title: "空间名称",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: "20%",
    },
    {
      title: "成员",
      dataIndex: "userList",
      key: "userList",
      ellipsis: true,
      width: "20%",
      render(userList: SimpleUser[]) {
        return <>{userList.map((item) => item.realName).join(",")}</>;
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      ellipsis: true,
      width: "15%",
    },
    {
      title: "空间状态",
      dataIndex: "status",
      key: "status",
      ellipsis: true,
      width: "10%",
      render(status: keyof typeof SpaceStatus) {
        return SpaceStatus[status];
      },
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      ellipsis: true,
      width: "20%",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      width: "15%",
      render(_, raw: ShareItem) {
        return (
          <Permission code="B150127" disabled>
            <Tooltip title="删除">
              <Typography.Link onClick={onDelete(raw)}>
                <IconFont type="shanchu" />
              </Typography.Link>
            </Tooltip>
          </Permission>
        );
      },
    },
  ];

  const [shareVisible, setShareVisible] = useState(false);

  const onAdd = async () => {
    await getMemberListByTeam(selectedGroup!.id);
    await getAllImageList();
    await getFactorStrategySysTemplate(selectedGroup!.id);
    getEnvTemplates();
    setShareVisible(true);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="w-1 h-5 mr-2 bg-red-600 float-start" />
          协作空间
        </div>
        <Permission code="B150126" hidden>
          <Button icon={<PlusOutlined />} type="primary" onClick={onAdd}>
            新建空间
          </Button>
        </Permission>
      </div>
      <Table
        columns={columns}
        dataSource={useDataSource<ShareItem>(shareList?.shareSpaceList)}
        size="small"
        loading={shareListLoading}
        pagination={false}
        scroll={{ y: 200 }}
      />
      {shareVisible && (
        <ShareModal visible={shareVisible} onVisibleChange={setShareVisible} />
      )}
    </div>
  );
});
