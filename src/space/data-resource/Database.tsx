import { clsPrefix } from "@transquant/constants";
import { Divider, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../hooks";
import { TableStructure } from "../types/dataResource";

interface DataType extends TableStructure {
  key: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "列名",
    dataIndex: "col_name",
    key: "col_name",
    width: 200,
    render: (text) => <a>{text}</a>,
  },
  {
    title: "字段类型",
    dataIndex: "data_type",
    key: "data_type",
  },
  {
    title: "默认值",
    dataIndex: "default_value",
    key: "default_value",
  },
  {
    title: "不可空",
    dataIndex: "not_null",
    key: "not_null",
  },
  {
    title: "唯一",
    dataIndex: "unique",
    key: "unique",
  },
  {
    title: "注释",
    dataIndex: "comment",
    key: "comment",
  },
];

const getDataSource = (data: TableStructure[] = []) => {
  return data.map((item, index) => ({
    key: `${index}`,
    ...item,
  }));
};

export default observer(function Database() {
  const { tableInfo } = useStores().dataResourceStore;
  return (
    <div className={`${clsPrefix}-data-resource-database`}>
      <div>列信息</div>
      <Table
        columns={columns}
        dataSource={getDataSource(tableInfo?.tableStructures)}
        size="small"
        scroll={{ y: 300 }}
        pagination={false}
      />
      <Divider type="horizontal" dashed />
    </div>
  );
});
