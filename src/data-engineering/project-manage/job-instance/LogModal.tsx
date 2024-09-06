import { Empty, Modal } from "antd";
import { observer } from "mobx-react";
import { Else, If, Then } from "react-if";

interface ProjectModalProps {
  data: string;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default observer(function LogModal(props: ProjectModalProps) {
  const { visible, onVisibleChange, data } = props;

  const onOk = () => {
    onVisibleChange(false);
  };

  return (
    <Modal
      title="查看日志"
      open={visible}
      okText="确定"
      onOk={onOk}
      onCancel={onOk}
      width={1200}
      className="job-instance-log-modal"
    >
      <If condition={data === ""}>
        <Then>
          <Empty />
        </Then>
        <Else>
          <code>
            <pre>{data}</pre>
          </code>
        </Else>
      </If>
    </Modal>
  );
});
