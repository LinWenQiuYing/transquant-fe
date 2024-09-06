import { useMount } from "ahooks";
import { Table, TableProps } from "antd";

interface PerformanceViewProps {
  id: number;
  data: DataType[];
  getPerformance: (id: number) => void;
}

interface DataType {
  cumtime: string;
  [`filename:lineno(function)`]: string;
  ncalls: string;
  tottime: string;
}

const column: TableProps<any>["columns"] = [
  {
    title: "ncalls",
    dataIndex: "ncalls",
  },
  {
    title: "tottime",
    dataIndex: "tottime",
  },
  {
    title: "cumtime",
    dataIndex: "cumtime",
  },
  {
    title: "filename:lineno(function)",
    dataIndex: "filename:lineno(function)",
  },
];

export default function PerformanceView(props: PerformanceViewProps) {
  const { id, getPerformance, data } = props;

  useMount(() => {
    getPerformance(id);
  });

  return (
    <Table
      columns={column}
      size="small"
      bordered
      dataSource={data}
      pagination={false}
      scroll={{ y: "calc(100vh - 300px)" }}
    />
  );
}
