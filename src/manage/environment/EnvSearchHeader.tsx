import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { IconFont } from "@transquant/ui";
import {
  Button,
  Col,
  Descriptions,
  Input,
  Popover,
  Row,
  Select,
  Space,
} from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../hooks";

export type IEnvSearch = {
  columnOrderBy: string;
  nodeList: string[];
  orderBy: number;
  teamName: string;
  userName: string;
  pageNum: number;
  pageSize: number;
};

export default observer(function SearchHeader() {
  const {
    getManagedEnvList,
    onCacheEnvConfigChange,
    onPaginationChange,
    nodes,
  } = useStores().environmentStore;
  const [config, setConfig] = useState<Partial<IEnvSearch>>({});
  const [popupVisible, setPopupVisible] = useState(false);

  const onSearch = () => {
    getManagedEnvList({
      ...config,
    });

    onPaginationChange({ pageNum: 1 });
    onCacheEnvConfigChange(config);
  };

  const onSort = () => {
    onSearch();
    setPopupVisible(false);
  };

  const onReset = () => {
    setConfig({ pageNum: 1 });
    onCacheEnvConfigChange({ pageNum: 1 });
    onPaginationChange({ pageNum: 1 });
  };

  const dropdownRender = (
    <div style={{ width: "200px" }}>
      <Row>
        <Col span={24}>排序列：</Col>
        <Col span={24}>
          <Select
            style={{ width: "100%" }}
            placeholder="请选择排序列"
            value={config.columnOrderBy}
            onChange={(value) => {
              setConfig({ ...config, columnOrderBy: value });
            }}
          >
            <Select.Option key="cpu_mem_limit">内存上限</Select.Option>
            <Select.Option key="cpu_core_limit">CPU上限</Select.Option>
            <Select.Option key="gpu_mem">GPU</Select.Option>
          </Select>
        </Col>
      </Row>
      <Row>
        <Col span={24}>排序方式：</Col>
        <Col span={24}>
          <Select
            style={{ width: "100%" }}
            placeholder="请选择排序方式"
            value={config.orderBy}
            onChange={(value) => {
              setConfig({ ...config, orderBy: value });
            }}
          >
            <Select.Option key={0}>不排序</Select.Option>
            <Select.Option key={1}>升序</Select.Option>
            <Select.Option key={2}>降序</Select.Option>
          </Select>
        </Col>
      </Row>
      <Row justify="end" style={{ marginTop: 10 }}>
        <Col>
          <Button
            style={{ marginRight: 20 }}
            onClick={() => setPopupVisible(false)}
          >
            取消
          </Button>
          <Button type="primary" onClick={onSort}>
            确认
          </Button>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="site-space-compact-wrapper">
      <Row justify="space-between" align="top">
        <Col span={24}>
          <Descriptions column={4} labelStyle={{ alignItems: "center" }}>
            <Descriptions.Item label="所属个人">
              <Input
                placeholder="请输入所属个人"
                value={config.userName}
                maxLength={15}
                onChange={(e) =>
                  setConfig({ ...config, userName: e.target.value })
                }
              />
            </Descriptions.Item>
            <Descriptions.Item label="所属团队">
              <Input
                placeholder="请输入所属团队"
                value={config.teamName}
                maxLength={15}
                onChange={(e) =>
                  setConfig({ ...config, teamName: e.target.value })
                }
              />
            </Descriptions.Item>

            <Descriptions.Item label="部署服务器">
              <Select
                placeholder="请选择部署服务器"
                value={config.nodeList}
                style={{ width: "100%" }}
                showSearch={false}
                mode="multiple"
                maxTagCount={1}
                onChange={(key) => {
                  setConfig({ ...config, nodeList: key });
                }}
                options={nodes.map((item) => ({ label: item, value: item }))}
              />
            </Descriptions.Item>
            <Col className="pl-4 text-right">
              <Space>
                <Popover
                  content={dropdownRender}
                  placement="bottom"
                  trigger={["click"]}
                  open={popupVisible}
                >
                  <Button
                    icon={<IconFont type="shaixuan" />}
                    onClick={() => setPopupVisible(true)}
                  >
                    排序
                  </Button>
                </Popover>
                <Button icon={<SyncOutlined />} onClick={onReset}>
                  重置
                </Button>
                <Button
                  icon={<SearchOutlined />}
                  type="primary"
                  onClick={onSearch}
                >
                  查询
                </Button>
              </Space>
            </Col>
          </Descriptions>
        </Col>
      </Row>
    </div>
  );
});
