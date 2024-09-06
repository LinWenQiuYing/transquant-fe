import { ExportOutlined } from "@ant-design/icons";
import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { clsPrefix, collapsedStyle, normalStyle } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { Button, DatePicker, Space } from "antd";
import { observer } from "mobx-react";
import { useStores as useManageStore } from "../hooks";
import { defaultRoutes } from "./helpers";
import "./index.less";
import LogTable from "./LogTable";

const { RangePicker } = DatePicker;

export default observer(function LogManage() {
  const { collapsed } = useStores().appStore;
  const { exportAuditLog, getAuditLog, rangeTime, onRangeTimeChange } =
    useManageStore().auditLogStore;

  const getBreadcrumbItems = () => {
    const items: BreadcrumbItem[] = defaultRoutes;

    return items;
  };

  const onExport = () => {
    if (!rangeTime?.startTime || !rangeTime?.endTime) {
      exportAuditLog();
      return;
    }
    exportAuditLog({
      ...rangeTime,
    });
  };

  const onRangePickerChange = (values: any, formatString: [string, string]) => {
    const [startTime, endTime] = formatString;

    onRangeTimeChange({
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    });
    getAuditLog({ pageIndex: 1, pageSize: 15 });
  };

  const extraEl = (
    <Space>
      <RangePicker onChange={onRangePickerChange} />
      <Permission code="B180101" disabled>
        <Button type="primary" icon={<ExportOutlined />} onClick={onExport}>
          导出
        </Button>
      </Permission>
    </Space>
  );

  return (
    <Permission code="log">
      <ContentPanel
        title={
          <TitlePanel
            items={getBreadcrumbItems()}
            style={collapsed ? collapsedStyle : normalStyle}
          />
        }
        cardTitle="日志列表"
        extra={extraEl}
        content={<LogTable />}
        className={`${clsPrefix}-log`}
      />
    </Permission>
  );
});
