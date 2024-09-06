import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { IconFont, LabelConfig, Permission } from "@transquant/ui";
import { Col, Input, Row, Space, Tag, Tooltip, Typography } from "antd";
import { TextAreaProps } from "antd/es/input";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { When } from "react-if";
import { useStores } from "../hooks";

export default observer(function Snapshot() {
  const { tableInfo, updateTimelyreTableLabel, setUserComment } =
    useStores().dataResourceStore;
  const [labelVisible, setLabelVisible] = useState(false);
  const [commentEditing, setCommentEditing] = useState(false);
  const [labels, setLabels] = useState(
    tableInfo?.labels?.map((item) => `${item.id}`)
  );

  useEffect(() => {
    setLabels(tableInfo?.labels.map((item) => `${item.id}`));
  }, [tableInfo]);

  const onLabelConfigChange = (value: string[]) => {
    setLabels(value);
  };

  const onLabelConfigOk = (labelNames: string[]) => {
    updateTimelyreTableLabel({
      labels: labelNames,
      dbName: tableInfo?.dbName || "",
      tableName: tableInfo?.tableName || "",
    });

    setLabelVisible(false);
  };

  const onCommentBlur: TextAreaProps["onBlur"] = async (e) => {
    await setUserComment({
      comment: e.target.value,
      dbName: tableInfo?.dbName || "",
      tableName: tableInfo?.tableName || "",
    });

    setTimeout(() => {
      setCommentEditing(false);
    }, 300);
  };

  const onVisibleChange = (value: boolean) => {
    if (value === false) {
      setLabels([]);
    }
    setLabelVisible(value);
  };

  return (
    <div className={`${clsPrefix}-data-resource-content-snapshot`}>
      <Row>
        <Col span={12} style={{ fontWeight: "bold", fontSize: 16 }}>
          <IconFont
            type="biao"
            style={{ marginRight: 10, color: "var(--red-600)" }}
          />
          {tableInfo?.tableName}
        </Col>
      </Row>
      <Row>
        <Space>
          <span>标签：</span>
          <div>
            <span>
              {tableInfo?.labels.map((item) => (
                <Tag bordered={false} key={item.id}>
                  {item.name}
                </Tag>
              ))}
            </span>
            <Permission code="B060101" disabled>
              <Tooltip title="标签设置">
                <Typography.Link onClick={() => setLabelVisible(true)}>
                  <SettingOutlined />
                </Typography.Link>
              </Tooltip>
            </Permission>
          </div>
        </Space>
      </Row>
      <Row>
        <Space className={`${clsPrefix}-snapshot-comment`}>
          <span>备注：</span>
          {commentEditing ? (
            <Input.TextArea
              defaultValue={tableInfo?.userComment}
              style={{ width: "100%" }}
              onBlur={onCommentBlur}
              maxLength={100}
            />
          ) : (
            <Space>
              <span>{tableInfo?.userComment}</span>
              <Permission code="B060102" disabled>
                <Typography.Link onClick={() => setCommentEditing(true)}>
                  <EditOutlined />
                </Typography.Link>
              </Permission>
            </Space>
          )}
        </Space>
      </Row>

      <When condition={labelVisible}>
        <LabelConfig
          type="personal"
          value={labels || []}
          visible={labelVisible}
          onVisibleChange={onVisibleChange}
          onChange={onLabelConfigChange}
          onOk={onLabelConfigOk}
        />
      </When>
    </div>
  );
});
