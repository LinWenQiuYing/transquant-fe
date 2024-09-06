import { useDataSource } from "@transquant/utils";
import { Form, InputNumber, Table } from "antd";
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { NodeConfig as NodeConfigType } from "../types/environment";

const EditableContext = React.createContext<any | null>(null);

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof NodeConfigType;
  record: DataType;
  handleSave: (record: NodeConfigType) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const inputRef = useRef<any>(null);
  const form = useContext(EditableContext)!;

  const save = async () => {
    try {
      const values = await form.validateFields();

      handleSave({ ...record, ...values, dataIndex });
      // eslint-disable-next-line no-empty
    } catch {}
  };

  let childNode = children;

  if (editable) {
    childNode = (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <InputNumber
          className="w-full"
          placeholder="请输入"
          min={0}
          ref={inputRef}
          defaultValue={
            record?.[dataIndex] === null ? undefined : record?.[dataIndex]
          }
          onPressEnter={save}
          onBlur={save}
          suffix={dataIndex === "envLimit" ? "个" : "%"}
        />
      </Form.Item>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType extends NodeConfigType {
  key: React.Key;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

interface NodeConfigProps {
  data: NodeConfigType[];
}

export default forwardRef(function NodeConfig(props: NodeConfigProps, ref) {
  const { data } = props;
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  useEffect(() => {
    const _data = data.map((item) => ({
      ...item,
      key: item.nodeName,
    }));
    setDataSource(_data);
  }, [data]);

  useImperativeHandle(ref, () => ({
    nodeConfig: dataSource,
  }));

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "节点名称",
      dataIndex: "nodeName",
      key: "nodeName",
      width: "20%",
    },
    {
      title: "环境个数上限",
      dataIndex: "envLimit",
      key: "envLimit",
      width: "20%",
      editable: true,
    },
    {
      title: "CPU预占比例上限",
      dataIndex: "cpuLimit",
      key: "cpuLimit",
      width: "20%",
      editable: true,
    },
    {
      title: "内存预占比例上限",
      dataIndex: "memLimit",
      key: "memLimit",
      width: "20%",
      editable: true,
    },
    {
      title: "GPU预占比例上限",
      dataIndex: "gpuLimit",
      key: "gpuLimit",
      width: "20%",
      editable: true,
    },
  ];

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    let item = newData[index];
    if (row.dataIndex) {
      item = {
        ...item,
        [row.dataIndex]: row[row.dataIndex],
      };
    }
    newData.splice(index, 1, item);
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={useDataSource(dataSource)}
        columns={columns as ColumnTypes}
        scroll={{ y: 200 }}
        pagination={false}
      />
    </div>
  );
});
