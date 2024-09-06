import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { Button, Col, DatePicker, Descriptions, Input, Row, Space } from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../hooks";
import { MessageSearchConfig } from "../types";

const { RangePicker } = DatePicker;

export default observer(function SearchHeader() {
  const { onConfigChange, onPaginationChange, getAllMessages } =
    useStores().messageStore;
  const [config, setConfig] = useState<Partial<MessageSearchConfig>>({});

  const onSearch = () => {
    onConfigChange(config);
    onPaginationChange({ pageNum: 1 });
    getAllMessages();
  };

  const onReset = () => {
    setConfig({});
    onConfigChange(config);
  };

  const collapseEl = (
    <Col span={8} style={{ textAlign: "right" }}>
      <Space>
        <Button icon={<SyncOutlined />} onClick={onReset}>
          重置
        </Button>
        <Button icon={<SearchOutlined />} type="primary" onClick={onSearch}>
          查询
        </Button>
      </Space>
    </Col>
  );

  return (
    <div className={`${clsPrefix}-table-filters`}>
      <Row justify="space-between" align="top">
        <Col span={16}>
          <Descriptions column={2} labelStyle={{ alignItems: "center" }}>
            <Descriptions.Item label="选择日期">
              <RangePicker
                className="item-input"
                value={[
                  config.notifyStartDate ? dayjs(config.notifyStartDate) : null,
                  config.notifyEndDate ? dayjs(config.notifyEndDate) : null,
                ]}
                onChange={(_: any, formatting: string[]) => {
                  setConfig({
                    ...config,
                    notifyStartDate: formatting[0] ? formatting[0] : undefined,
                    notifyEndDate: formatting[1] ? formatting[1] : undefined,
                  });
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="内容">
              <Input
                className="item-input"
                placeholder="内容"
                value={config.notifyContent}
                onChange={(e) =>
                  setConfig({ ...config, notifyContent: e.target.value })
                }
              />
            </Descriptions.Item>
          </Descriptions>
        </Col>
        {collapseEl}
      </Row>
    </div>
  );
});
