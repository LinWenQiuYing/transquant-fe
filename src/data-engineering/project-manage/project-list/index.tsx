import { clsPrefix } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Button, Card, Input, Space } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { ProjectListItem } from "../../types";
import "./index.less";
import ProjectModal from "./ProjectModal";
import ProjectTable from "./ProjectTable";

const { Search } = Input;

export default observer(function BasePiece({
  fromManage = false,
}: {
  fromManage?: boolean;
}) {
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const { onProjectSearchConfig, getProjectList } =
    useStores().projectManageStore;

  const onSearch: SearchProps["onSearch"] = (value) => {
    onProjectSearchConfig({ searchVal: value });
    getProjectList(fromManage);
  };

  const extraEl = (
    <Space>
      <Search
        placeholder="请输入项目名称"
        allowClear
        onSearch={onSearch}
        style={{ width: 200 }}
      />
      {!fromManage && (
        <Permission code="B100101" hidden>
          <Button type="primary" onClick={() => setProjectModalVisible(true)}>
            创建项目
          </Button>
        </Permission>
      )}
    </Space>
  );

  return (
    <Card
      title="项目列表"
      extra={extraEl}
      className={`${clsPrefix}-project-list`}
    >
      <ProjectTable fromManage={fromManage} />
      {projectModalVisible && (
        <ProjectModal<DataType<ProjectListItem>>
          title="创建项目"
          visible={projectModalVisible}
          onVisibleChange={(value) => setProjectModalVisible(value)}
        />
      )}
    </Card>
  );
});
