import { PopoverTag } from "@transquant/common";
import { FactorResultItem } from "@transquant/space/types";
import { IconFont } from "@transquant/ui";
import { DataType, useDataSource } from "@transquant/utils";
import useMount from "ahooks/lib/useMount";
import { Table, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useStores } from "../../hooks";
import ChatViewModal from "./ChatViewModal";

export default observer(function FactorResultList() {
  const {
    getFactorResultListByProcessInstanceId,
    factorResultList,
    getFactorResultJSON,
    factorResultListLoading,
  } = useStores().publishStore;
  const params = useParams();
  const [visible, setVisible] = useState<boolean>(false);

  useMount(() => {
    getFactorResultListByProcessInstanceId(params.id);
  });

  const onView = (data: DataType<FactorResultItem>) => {
    getFactorResultJSON(`${data.id}`);
    setVisible(true);
  };

  const columns: ColumnsType<DataType<FactorResultItem>> = [
    {
      title: "类名",
      dataIndex: "className",
      width: 200,
      fixed: "left" as "left",
    },
    {
      title: "因子名称",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "标签",
      key: "tags",
      dataIndex: "tags",
      width: 300,
      ellipsis: true,
      render: (_, { tags }) => <PopoverTag tags={tags} />,
    },
    {
      title: "修改时间",
      dataIndex: "srcUpdateTime",
      width: 200,
    },
    {
      title: "回测时间",
      dataIndex: "triggerTime",
      width: 200,
    },
    {
      title: "回测时间区间",
      dataIndex: "timeRange",
      width: 200,
    },
    {
      title: "IC",
      dataIndex: "ic",
      width: 200,
    },
    {
      title: "IR",
      dataIndex: "ir",
      width: 200,
    },
    {
      title: "因子年化收益率",
      dataIndex: "annFactorReturn",
      width: 200,
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_: any, data: DataType<FactorResultItem>) => (
        <Tooltip title="查看详情">
          <Typography.Link onClick={() => onView(data)}>
            <IconFont type="chakanxiangqing" />
          </Typography.Link>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={useDataSource<FactorResultItem>(factorResultList)}
        pagination={false}
        loading={factorResultListLoading}
        scroll={{ x: 1200 }}
        size="small"
      />
      {visible && (
        <ChatViewModal
          visible={visible}
          onVisibleChange={(value: boolean) => setVisible(value)}
        />
      )}
    </>
  );
});
