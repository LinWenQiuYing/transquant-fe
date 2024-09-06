import {
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { BenchData } from "@transquant/space/types";
import { AnyObject, UUID } from "@transquant/utils";
import { Button, Form, Input, Table, Tooltip, Typography } from "antd";
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./index.less";

const EditableContext = React.createContext<any>(null);

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType extends BenchData {
  key: React.Key;
}

type Item = DataType;

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

interface CalculateConfProps {
  propData?: BenchData[];
}

interface EditableRowProps {
  index: number;
}

type Tip = {
  [key in keyof Item]?: {
    title: string;
    placeholder: string;
  };
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
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

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<any>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  const tips: Tip = {
    name: {
      title: "基准名称",
      placeholder: "请输入基准名称",
    },
    param: {
      title: "参数",
      placeholder: "请按顺序输入参数",
    },
  };

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${tips[dataIndex]?.title}为必填项`,
          },
        ]}
      >
        <Input
          ref={inputRef}
          onPressEnter={save}
          placeholder={`${tips[dataIndex]?.placeholder || ""}`}
          onBlur={save}
        />
      </Form.Item>
    ) : (
      <div
        className="h-8 align-top editable-cell-value-wrap"
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default forwardRef(function BenchConf(props: CalculateConfProps, ref) {
  const { propData } = props;
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  useEffect(() => {
    if (!propData) return;
    const list = propData?.map((item, index) => ({
      ...item,
      key: index,
    }));
    setDataSource(list);
  }, [propData]);

  useImperativeHandle(ref, () => ({
    benchDataList: dataSource,
  }));

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: (
        <div>
          <span className="mr-2 text-red-600">*</span>基准名称
        </div>
      ),
      dataIndex: "name",
      editable: true,
      width: "45%",
    },
    {
      title: (
        <div>
          <span className="mr-2 text-red-600">*</span>
          参数
          <Tooltip title="请按照数据库、数据表、订阅的标的、字段名、滞后天数的顺序输入，以英文逗号空格分隔">
            <QuestionCircleOutlined className="ml-2 text-gray-400 cursor-pointer" />
          </Tooltip>
        </div>
      ),
      dataIndex: "param",
      editable: true,
      width: "45%",
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: "10%",
      align: "center",
      render: (_, record: AnyObject) => (
        <Typography.Link onClick={() => handleDelete(record.key)}>
          <DeleteOutlined />
        </Typography.Link>
      ),
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: UUID(),
      name: "",
      param: "",
    };
    setDataSource([...dataSource, newData]);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
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
    <div className="factor-arg-config">
      <div className="font-bold">基准数据</div>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={false}
        size="small"
      />
      <Button
        onClick={handleAdd}
        type="dashed"
        danger
        className="mt-3"
        icon={<PlusOutlined />}
        block
        disabled={!!dataSource.length}
      >
        添加
      </Button>
    </div>
  );
});
