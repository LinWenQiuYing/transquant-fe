import { CloudUploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { USER_TOKEN } from "@transquant/constants";
import { DataType, ls } from "@transquant/utils";
import { getToken } from "@transquant/utils/ajax";
import useMount from "ahooks/lib/useMount";
import {
  Button,
  Card,
  message,
  Modal,
  Table,
  Tooltip,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../hooks";
import { TransmatrixItem } from "../types";

const getDataSource = (data?: TransmatrixItem[]) => {
  if (!data) return [];
  return data.map((item, index) => ({
    key: index,
    ...item,
  }));
};

// 上传文件类型校验
const isWhl = (file: any) => {
  return /\.(whl)$/.test(file.name);
};

export default observer(function TransmatrixTable() {
  const {
    showTransMatrixFile,
    transmatrixLoading,
    deleteTransMatrixFile,
    transmatrixList,
  } = useStores().systemStore;

  useMount(() => {
    showTransMatrixFile();
  });

  const onDelete = (record: DataType<TransmatrixItem>) => {
    Modal.confirm({
      title: (
        <div>
          是否确认删除
          <span style={{ color: "var(--red-600)" }}>「{record.fileName}」</span>
          ？
        </div>
      ),
      onOk: () => {
        deleteTransMatrixFile(record.fileName);
      },
    });
  };

  const columns: ColumnsType<DataType<TransmatrixItem>> = [
    {
      title: "文件",
      dataIndex: "fileName",
      key: "fileName",
      width: "35%",
      ellipsis: true,
      render: (fileName: string) => {
        return <Typography.Link>{fileName}</Typography.Link>;
      },
    },
    {
      title: "上传时间",
      dataIndex: "createDate",
      key: "createDate",
      width: "35%",
      ellipsis: true,
    },
    {
      title: "大小",
      dataIndex: "fileLength",
      key: "fileLength",
      width: "20%",
      ellipsis: true,
      render: (fileLength: string) => {
        return <span>{fileLength} 字节</span>;
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      width: "10%",
      render: (_: any, record: DataType<TransmatrixItem>) => {
        return (
          <Typography.Link onClick={() => onDelete(record)}>
            <Tooltip title="删除">
              <DeleteOutlined />
            </Tooltip>
          </Typography.Link>
        );
      },
    },
  ];

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "done") {
      if (!isWhl(info.file)) {
        message.warning("非whl文件类型");
        return;
      }
      message.success("上传成功");
      showTransMatrixFile();
    }
  };

  const beforeUpload: UploadProps["beforeUpload"] = async (file) => {
    const fileNames = transmatrixList.map((item) => item.fileName);

    return new Promise((resolve, reject) => {
      if (fileNames.includes(file.name)) {
        Modal.confirm({
          title: `已包含一个名为${file.name}的文件，是否替换该文件？?`,
          onOk: () => {
            resolve();
          },
          onCancel() {
            reject();
          },
        });
      } else {
        resolve();
      }
    });
  };

  const url = "/tqlab/upgradeFile/addTransMatrixFile";

  const props = {
    action: url,
    onChange: handleChange,
    headers: {
      token: getToken(ls.getItem(USER_TOKEN), url),
    },
    multiple: true,
    showUploadList: false,
    beforeUpload,
    accept: ".whl",
  };

  const extraEl = (
    <Upload {...props}>
      <Button icon={<CloudUploadOutlined />} type="primary">
        上传
      </Button>
    </Upload>
  );

  return (
    <Card title="TransMatrix安装包" extra={extraEl}>
      <Table
        columns={columns}
        dataSource={getDataSource(transmatrixList)}
        loading={transmatrixLoading}
        size="small"
        bordered
        scroll={{ y: 150 }}
        pagination={false}
      />
    </Card>
  );
});
