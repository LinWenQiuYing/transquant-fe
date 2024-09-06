import {
  DeleteOutlined,
  MenuOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { clsPrefix } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import { UUID } from "@transquant/utils";
import { Button, Checkbox, Form, Input, Select, Table, Tooltip } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { observer } from "mobx-react";
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { When } from "react-if";
import { useStores } from "../hooks";
import { CreateTableType } from "./TableModal";
import UploadTable from "./UploadTable";

export type DataType = {
  key: string;
  name: string;
  type: string;
  length: number | undefined;
  tag: boolean;
  comment: string;
};

type EditableCellProps = {
  title: React.ReactNode;
  editable: boolean;
  editType: "input" | "select" | "checkbox";
  children: React.ReactNode;
  dataIndex: keyof DataType;
  record: DataType;
  handleSave: (record: DataType) => void;
};

type EditableTableProps = Parameters<typeof Table>[number];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const fieldType = [
  "timestamp",
  "string",
  "char",
  "varchar",
  "varchar2",
  "int",
  "bigint",
  "tinyint",
  "smallint",
  "date",
  "float",
  "double",
  "boolean",
];

const canCheckFields = [
  "char",
  "varchar",
  "string",
  "tinyint",
  "smallint",
  "bigint",
];

const EditableContext = React.createContext<any>(null);

const EditableRow: React.FC<{
  index: number;
  "data-row-key": string;
  style: React.CSSProperties;
  children: React.ReactNode;
}> = (props) => {
  const { index, children, ...restProps } = props;
  const [form] = Form.useForm();
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: restProps["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr
          {...restProps}
          style={style}
          ref={setNodeRef}
          {...attributes}
          data-index={index}
        >
          {React.Children.map(children, (child) => {
            if ((child as React.ReactElement).key === "sort") {
              return React.cloneElement(child as React.ReactElement, {
                children: (
                  <MenuOutlined
                    ref={setActivatorNodeRef}
                    style={{ touchAction: "none", cursor: "move" }}
                    {...listeners}
                  />
                ),
              });
            }
            return child;
          })}
        </tr>
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell: React.FC<EditableCellProps> = (props) => {
  const {
    editable,
    children,
    dataIndex,
    editType,
    record,
    handleSave,
    ...restProps
  } = props;
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<any>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);

    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      let values = await form.validateFields();

      toggleEdit();
      if ("length" in values) {
        const length = Number.parseInt(values.length);
        values = { length: isNaN(length) ? undefined : length };
      }
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  const editNode = {
    input: (
      <Input
        ref={inputRef}
        defaultValue={(record?.[dataIndex] || "") as string}
        onPressEnter={save}
        onBlur={save}
      />
    ),
    select: (
      <Select
        options={fieldType.map((field) => ({ label: field, value: field }))}
        // ref={inputRef}
        onSelect={save}
        defaultValue={record?.[dataIndex]}
      />
    ),
    checkbox: (
      <Checkbox
        // ref={inputRef}
        disabled={!canCheckFields.includes(record?.type)}
        defaultChecked={(record?.[dataIndex] || false) as boolean}
        onChange={save}
      />
    ),
  };

  const pattern = () => {
    switch (dataIndex) {
      case "name":
        return {
          required: true,
          pattern: /^[a-z_][a-z0-9_]*$/,
          message: "请检查输入是否有误",
        };
      case "length":
        return {
          pattern: /^[0-9]\d*$/,
          message: "仅支持输入数字",
        };
      default:
        break;
    }
  };

  const rule = pattern();

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        valuePropName={editType === "checkbox" ? "checked" : "value"}
        rules={
          rule && [
            {
              required: rule?.required,
              pattern: rule?.pattern,
              message: rule?.message,
            },
          ]
        }
      >
        {editNode[editType]}
      </Form.Item>
    ) : (
      <div
        className={`${
          !canCheckFields.includes(record.type) &&
          dataIndex === "tag" &&
          "bg-gray-100 cursor-not-allowed pointer-events-none"
        } editable-cell-value-wrap h-[32px]`}
        onClick={toggleEdit}
      >
        <When condition={dataIndex === "tag"}>
          {record[dataIndex] ? "√" : "-"}
        </When>
        <div className="w-full h-5">
          {children}
          {dataIndex === "type" && (
            <span className="float-right text-gray-300 scale-y-150 rotate-90 scale-x-120">
              {">"}
            </span>
          )}
        </div>
      </div>
    );
  }

  return <td {...(restProps as any)}>{childNode}</td>;
};

export default observer(
  forwardRef(function ImportTable(
    props: { createTableType: CreateTableType },
    ref
  ) {
    const { createTableType } = props;
    const { tableHeaders } = useStores().dataResourceStore;
    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const [uploadVisible, setUploadVisible] = useState(false);

    useEffect(() => {
      const tables = tableHeaders.map((header, index) => ({
        key: `${index}`,
        name: header,
        type: header === "datetime" ? "timestamp" : "string",
        length: undefined,
        tag: false,
        comment: "",
      }));

      setDataSource(tables);
    }, [tableHeaders]);

    useImperativeHandle(ref, () => {
      return {
        columnParams: dataSource,
      };
    });

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

    const onDelete = (key: string) => {
      const newData = dataSource.filter((item) => item.key !== key);
      setDataSource(newData);
    };

    const defaultColumns: (ColumnTypes[number] & {
      editable?: boolean;
      editType?: "input" | "select" | "checkbox";
      dataIndex: string;
    })[] = [
      {
        key: "sort",
        dataIndex: "sort",
        width: "5%",
      },
      {
        title: (
          <div className="flex items-center">
            <IconFont type="wenzi" className="mr-2 text-gray-400" />
            <span>
              列名
              <Tooltip title="仅支持输入字母、数字及下划线‘_’，且不能以数字开头，统一为小写">
                <QuestionCircleOutlined className="ml-1 text-gray-400" />
              </Tooltip>
            </span>
          </div>
        ),
        dataIndex: "name",
        width: "20%",
        editable: true,
        ellipsis: true,
        editType: "input",
      },
      {
        title: (
          <div>
            <IconFont type="xiala" className="mr-2 text-gray-400" />
            <span>
              字段类型
              <Tooltip title="时序表中必须包含且仅包含一列字段类型为timestamp">
                <QuestionCircleOutlined className="ml-1 text-gray-400" />
              </Tooltip>
            </span>
          </div>
        ),
        dataIndex: "type",
        width: "20%",
        editable: true,
        ellipsis: true,
        editType: "select",
      },
      {
        title: (
          <div>
            <IconFont type="shuzi" className="mr-2 text-gray-400" />
            <span>
              长度
              <Tooltip title="当字段类型为char、varchar、varchar2时需填写此项">
                <QuestionCircleOutlined className="ml-1 text-gray-400" />
              </Tooltip>
            </span>
          </div>
        ),
        dataIndex: "length",
        width: "15%",
        editable: true,
        editType: "input",
      },
      {
        title: (
          <div>
            <IconFont type="duoxuan" className="mr-2 text-gray-400" />
            <span>
              tag
              <Tooltip title="当字段类型为char、varchar、string、tinyint、smallint、bigint时可勾选此项">
                <QuestionCircleOutlined className="ml-1 text-gray-400" />
              </Tooltip>
            </span>
          </div>
        ),
        dataIndex: "tag",
        key: "tag",
        width: "10%",
        editable: true,
        align: "center",
        editType: "checkbox",
      },
      {
        title: (
          <div>
            <IconFont type="wenzi" className="mr-2 text-gray-400" />
            注释
          </div>
        ),
        dataIndex: "comment",
        width: "20%",
        editType: "input",
        editable: true,
        ellipsis: true,
      },
      {
        title: "操作",
        dataIndex: "action",
        width: "10%",
        render: (_, record: AnyObject) => {
          return (
            <Tooltip title="删除">
              <DeleteOutlined
                onClick={() => onDelete(record.key)}
                className="text-red-600"
              />
            </Tooltip>
          );
        },
      },
    ];

    const columns = useMemo(() => {
      let _columns = defaultColumns;
      if (createTableType === "ORC" || createTableType === "TEXT") {
        _columns = _columns.filter((item) => item.dataIndex !== "tag");
      }
      return _columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: DataType) => ({
            record,
            editType: col.editType,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave,
          }),
        };
      });
    }, [createTableType, dataSource]);

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
      if (active.id !== over?.id) {
        setDataSource((previous) => {
          const activeIndex = previous.findIndex((i) => i.key === active.id);
          const overIndex = previous.findIndex((i) => i.key === over?.id);
          return arrayMove(previous, activeIndex, overIndex);
        });
      }
    };

    const onAdd = () => {
      const newItem = {
        key: `${UUID()}`,
        name: "",
        type: "string",
        length: undefined,
        tag: false,
        comment: "",
      };
      setDataSource([...dataSource, newItem]);
    };

    return (
      <div className={`${clsPrefix}-data-resource-import-table`}>
        <div className="flex justify-between mb-0">
          <span>列信息</span>
          <Button type="primary" onClick={() => setUploadVisible(true)}>
            导入
          </Button>
        </div>
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            // rowKey array
            items={dataSource.map((i) => i.key)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={components}
              rowKey="key"
              columns={columns as ColumnTypes}
              bordered
              size="small"
              pagination={false}
              scroll={{ y: 300 }}
              rowClassName={() => "editable-row"}
              dataSource={dataSource}
            />
          </SortableContext>
        </DndContext>
        <Button
          className="mt-3"
          block
          type="dashed"
          danger
          icon={<PlusOutlined />}
          onClick={onAdd}
        >
          添加
        </Button>
        <UploadTable
          visible={uploadVisible}
          onVisibleChange={(value) => setUploadVisible(value)}
        />
      </div>
    );
  })
);
