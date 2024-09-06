import { clsPrefix } from "@transquant/constants";
import { Divider, Table } from "antd";
import { observer } from "mobx-react";
import { useStores } from "../hooks";

const getColumns = (columns: string[] = []) => {
  return columns.map((column) => ({
    title: () => (
      <div
        className={`${clsPrefix}-ellipsis`}
        title={column}
        style={{ maxWidth: 200 }}
      >
        {column}
      </div>
    ),
    dataIndex: column,
    key: column,
    width: 200,
    render: (value: any) => {
      return (
        <div
          className={`${clsPrefix}-ellipsis`}
          title={value}
          style={{ maxWidth: 200 }}
        >
          {value ?? "-"}
        </div>
      );
    },
  }));
};

const getDataSource = (data: Record<string, unknown>[] = []) => {
  return data.map((item, index) => ({
    key: `${index}`,
    ...item,
  }));
};

export default observer(function DataExample() {
  const { dataExamples } = useStores().dataResourceStore;
  return (
    <div className={`${clsPrefix}-data-resource-example`}>
      <div>数据样例</div>
      <Table
        columns={getColumns(dataExamples?.columns)}
        dataSource={getDataSource(dataExamples?.datas)}
        size="small"
        scroll={{
          x: (dataExamples?.columns.length || 0) * 200,
          y: 300,
        }}
        pagination={false}
      />
      <Divider />
    </div>
  );
});
