import { IconFont } from "@transquant/ui";
import {
  Button,
  Col,
  DatePicker,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import moment from "moment";
import { ChangeEventHandler, useState } from "react";
import { useStores } from "../hooks";

interface UploadModalProps {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default observer(function DownloadModal(props: UploadModalProps) {
  const { visible, onVisibleChange } = props;
  const {
    tableInfo,
    downloadDataFileCount,
    checkInfo,
    checkLoading,
    resetCheckInfo,
    downloadDataFile,
  } = useStores().dataResourceStore;
  const [state, setState] = useState({
    filterType: tableInfo?.filterTypes[0],
    code: "",
    startTime: "",
    endTime: "",
  });

  const onFilterTypeChange = (e: RadioChangeEvent) => {
    setState({ ...state, filterType: e.target.value });
    resetCheckInfo();
  };

  const onCodeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState({ ...state, code: e.target.value });
  };

  const getParams = () => {
    if (!tableInfo) return;
    let params: any = {
      dbName: tableInfo.dbName,
      tableName: tableInfo.tableName,
    };

    if (state.filterType === 0) {
      params = {
        ...params,
        startTime: state.startTime,
        endTime: state.endTime,
      };
    } else {
      params = {
        ...params,
        code: state.code,
      };
    }
    return params;
  };

  const onCheck = () => {
    const params = getParams();

    downloadDataFileCount(params);
  };

  const onOk = () => {
    const params = getParams();
    downloadDataFile(params);
    onVisibleChange(false);
    resetCheckInfo();
  };

  const onCancel = () => {
    onVisibleChange(false);
    resetCheckInfo();
  };

  const checkEl = (
    <Button onClick={onCheck} loading={checkLoading}>
      {checkLoading ? "校验中" : "校验"}
    </Button>
  );

  return (
    <Modal
      title="下载数据"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose
      width={560}
      okButtonProps={{
        disabled: !checkInfo || checkInfo.message.includes("查出0条记录"),
      }}
    >
      <Row align="middle" style={{ paddingBottom: 20 }}>
        <Col span={4}>筛选时间：</Col>
        <Col span={20}>
          <Radio.Group onChange={onFilterTypeChange} value={state.filterType}>
            <Radio value={0} disabled={!tableInfo?.filterTypes.includes(0)}>
              时间
            </Radio>
            <Radio value={1} disabled={!tableInfo?.filterTypes.includes(1)}>
              资产代码
            </Radio>
          </Radio.Group>
        </Col>
      </Row>
      {state.filterType === 0 ? (
        <Row align="middle">
          <Col span={4}>时间选择：</Col>
          <Col span={20}>
            <Space>
              <DatePicker.RangePicker
                style={{ width: 320 }}
                value={[
                  state.startTime ? dayjs(state.startTime) : null,
                  state.endTime ? dayjs(state.endTime) : null,
                ]}
                disabledDate={(current) => current > moment().endOf("day")}
                onChange={(_: any, formatting: string[]) => {
                  setState({
                    ...state,
                    startTime: formatting[0],
                    endTime: formatting[1],
                  });
                }}
              />
              {checkEl}
            </Space>
          </Col>
        </Row>
      ) : (
        <Row align="middle">
          <Col span={4}>资产代码：</Col>
          <Col span={20}>
            <Space>
              <Input
                placeholder="请输入资产代码"
                onChange={onCodeChange}
                value={state.code}
                style={{ width: 320 }}
              />
              {checkEl}
            </Space>
          </Col>
        </Row>
      )}

      {checkInfo && (
        <Row>
          {checkInfo.success ? (
            <IconFont
              type="check-circle"
              style={{ color: "var(--green-600)" }}
            />
          ) : (
            <IconFont
              type="exclamation-circle"
              style={{ color: "var(--red-600)" }}
            />
          )}
          <Typography.Text disabled>{checkInfo.message}</Typography.Text>
        </Row>
      )}
    </Modal>
  );
});
