import { ExportOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";

enum ExportEnum {
  Excel = "excel",
  PDF = "pdf",
}

const exportItems: MenuProps["items"] = [
  { key: ExportEnum.Excel, label: "导出为Excel" },
  { key: ExportEnum.PDF, label: "导出为PDF" },
];

export default function useExtra() {
  const onExportClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case ExportEnum.Excel:
        // console.log("excel");
        break;
      case ExportEnum.PDF:
        // console.log("pdf");
        break;
      default:
        break;
    }
  };

  const exportEl = (
    <Dropdown
      menu={{
        items: exportItems,
        onClick: onExportClick,
      }}
    >
      <Button type="primary" icon={<ExportOutlined />}>
        导出
      </Button>
    </Dropdown>
  );

  return {
    extraEl: exportEl,
  };
}
