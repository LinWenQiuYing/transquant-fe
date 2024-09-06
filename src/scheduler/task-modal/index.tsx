import { Modal } from "antd";
import { useRef } from "react";
import { EditWorkflowDefinition, ITaskData } from "../dag/types";
import ETL from "./ETL";
import "./index.less";
import Python from "./Python";
import SQL from "./SQL";

interface TaskModalProps {
  visible: boolean;
  readonly: boolean;
  projectCode: number;
  onCancel: () => void;
  onSubmit: ({ data }: any) => void;
  definition: EditWorkflowDefinition;
  data: ITaskData;
}

export default function TaskModal(props: TaskModalProps) {
  const { visible, onCancel, onSubmit, data, definition } = props;
  const sqlRef = useRef<{ validate: () => any }>(null);
  const etlRef = useRef<{ validate: () => any }>(null);
  const pythonRef = useRef<{ validate: () => any }>(null);

  const getContext = () => {
    switch (data.taskType) {
      case "SQL":
        return <SQL ref={sqlRef} data={data} definition={definition} />;
      case "DATAX":
        return <ETL ref={etlRef} data={data} definition={definition} />;
      case "PYTHON":
        return <Python ref={pythonRef} data={data} definition={definition} />;
      default:
        break;
    }
  };

  const onOk = async () => {
    let result;
    switch (data.taskType) {
      case "SQL":
        result = await sqlRef.current?.validate();
        break;
      case "DATAX":
        result = await etlRef.current?.validate();
        break;
      case "PYTHON":
        result = await pythonRef.current?.validate();
        break;
      default:
        break;
    }

    onSubmit({ data: result });
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      className="task-modal"
      width={620}
      closable={false}
    >
      {getContext()}
    </Modal>
  );
}
