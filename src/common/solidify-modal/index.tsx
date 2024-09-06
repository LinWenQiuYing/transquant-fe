import { ImageInstance } from "@transquant/app/types";
import { ajax, useDataSource } from "@transquant/utils";
import { useMount } from "ahooks";
import { Checkbox, Modal, Table } from "antd";
import { TableProps } from "antd/lib";
import { useState } from "react";

interface SolidifyModalProps {
  title?: string;
  onOk: Function;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const columns: TableProps<ImageInstance>["columns"] = [
  {
    title: "环境名称",
    dataIndex: "name",
  },
  {
    title: "镜像名称",
    dataIndex: "imageName",
  },
];

export default function SolidifyModal(props: SolidifyModalProps) {
  const { title = "退出登录", visible, onVisibleChange } = props;
  const [envList, setEnvList] = useState<ImageInstance[]>([]);
  const [solidify, setSolidify] = useState(0);

  useMount(async () => {
    const result = await ajax<ImageInstance[]>({
      url: `/tqlab/k8s/getPrivateEnvList`,
    });
    if (!result.length) return;
    setEnvList(result.filter((item) => item.envStatus !== 0));
  });

  const onOk = () => {
    props.onOk(solidify);
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={onOk}
      onCancel={() => onVisibleChange(false)}
    >
      <div className="pb-2 text-gray-500 ">
        退出将同步关闭以下环境，是否确定退出？
      </div>
      <Table
        columns={columns}
        dataSource={useDataSource<ImageInstance>(envList)}
        bordered
        pagination={false}
        className="mb-4"
      />
      <Checkbox
        value={solidify}
        onChange={(e) => setSolidify(e.target.checked ? 1 : 0)}
      >
        关闭前固化以上环境
      </Checkbox>
    </Modal>
  );
}
