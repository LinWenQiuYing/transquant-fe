import { Card, Table } from "antd";

const getColumns = (columns: string[]) => {
  return columns.map((item) => ({
    title: item,
    dataIndex: item,
    key: item,
  }));
};
const getDataSource = (data: any) => {
  return data.map((item: any) => ({
    key: item.id,
    ...item,
  }));
};

export default function TableView(props: any) {
  const { data } = props;
  return (
    <div>
      <Card title={data.title} bordered={false} size="small" />
      <Table
        columns={getColumns(data.columns)}
        dataSource={getDataSource(data.data)}
        pagination={false}
      />
    </div>
  );
}
