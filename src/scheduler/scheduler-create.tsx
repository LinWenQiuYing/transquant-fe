import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { createProcessDefinition } from "./api";
import Dag, { SaveData } from "./dag";

export default function SchedulerCreate() {
  const navigate = useNavigate();
  const params = useParams();
  const projectCode = +(params?.id || 0);

  const onSave = ({
    taskDefinitions,
    saveForm,
    connects,
    locations,
  }: SaveData) => {
    const globalParams = saveForm.globalParams?.map((p) => {
      return {
        prop: p.key,
        value: p.value,
        direct: p.direct,
        type: "VARCHAR",
      };
    });

    createProcessDefinition(
      {
        taskDefinitionJson: JSON.stringify(taskDefinitions),
        taskRelationJson: JSON.stringify(connects),
        locations: JSON.stringify(locations),
        name: saveForm.name,
        executionType: saveForm.executionType,
        description: saveForm.description,
        globalParams: JSON.stringify(globalParams),
        timeout: saveForm.timeoutFlag ? saveForm.timeout : 0,
      },
      projectCode
    ).then(() => {
      message.success("保存成功");
      navigate(-1);
    });
  };

  return (
    <div className="w-full h-full p-5 bg-white rounded-lg">
      <Dag projectCode={projectCode} onSave={onSave} />
    </div>
  );
}
