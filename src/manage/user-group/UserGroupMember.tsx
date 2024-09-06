import { PlusOutlined } from "@ant-design/icons";
import { IconFont, Permission } from "@transquant/ui";
import { DataType, useDataSource, usePagination } from "@transquant/utils";
import {
  Button,
  Card,
  Input,
  Modal,
  Space,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from "antd";
import { SearchProps } from "antd/es/input";
import { observer } from "mobx-react";
import { useDeferredValue, useMemo, useState } from "react";
import { useStores } from "../hooks";
import { Member } from "../types";
import AddMemberModal from "./AddMemberModal";

export default observer(function UserGroupMember() {
  const {
    onSearchValueChange,
    searchValue,
    removeGroupMember,
    filterMembers,
    memberPagination,
    membersLoading,
    membersTotal,
    onMemberPaginationChange,
    getGroupMembers,
    getAllSimpleUsers,
    selectedGroup,
  } = useStores().userGroupStore;
  let deferMembers = useDeferredValue(filterMembers);

  deferMembers = useMemo(() => {
    return selectedGroup ? deferMembers : [];
  }, [selectedGroup, deferMembers]);

  const [addVisible, setAddVisible] = useState(false);

  const onSearch: SearchProps["onChange"] = (e) => {
    onSearchValueChange(e.target.value);
  };

  const onAdd = () => {
    getAllSimpleUsers();
    setAddVisible(true);
  };

  const disabled = useMemo(() => !selectedGroup, [selectedGroup]);

  const extraEl = (
    <Space>
      <Input.Search
        placeholder="请输入用户名或姓名"
        value={searchValue}
        onChange={onSearch}
        disabled={disabled}
      />
      <Permission code="B140110" hidden>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
          disabled={disabled}
        >
          添加成员
        </Button>
      </Permission>
    </Space>
  );

  const onRemove = (userId: number) => () => {
    Modal.confirm({
      title: "是否确认移出选中用户？",
      onOk() {
        removeGroupMember(userId);
      },
    });
  };

  const columns: TableProps<DataType<Member>>["columns"] = [
    {
      title: "姓名",
      dataIndex: "realName",
      key: "realName",
    },
    {
      title: "用户名",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render(_, record: DataType<Member>) {
        return (
          <Permission code="B140111" disabled>
            <Tooltip title="移出">
              <Typography.Link
                onClick={onRemove(record.id)}
                disabled={record.userName === "admin"}
              >
                <IconFont type="yichu" />
              </Typography.Link>
            </Tooltip>
          </Permission>
        );
      },
    },
  ];

  return (
    <Card title="成员管理" extra={extraEl}>
      <Table
        columns={columns}
        size="small"
        dataSource={useDataSource<Member>(deferMembers)}
        loading={membersLoading}
        pagination={{
          ...usePagination({
            total: membersTotal,
            IPageNum: memberPagination.pageNum,
            IPageSize: memberPagination.pageSize,
            onPaginationChange: onMemberPaginationChange,
            onRequest(pageIndex, pageSize) {
              getGroupMembers(pageIndex, pageSize);
            },
          }),
        }}
      />
      {addVisible && (
        <AddMemberModal visible={addVisible} onVisibleChange={setAddVisible} />
      )}
    </Card>
  );
});
