import { useMount } from "ahooks";
import { message } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { queryProcessInstanceById, updateProcessDefinition } from "./api";
import Dag, { SaveData } from "./dag";

export default function SchedulerInstance() {
  const params = useParams();
  const projectCode = +(params?.id || 0);
  const code = +(params?.code || 0);
  const [definition, setDefinition] = useState();
  const [readonly, setReadonly] = useState<boolean>(false);
  const navigate = useNavigate();
  const getDefinition = () => {
    queryProcessInstanceById(projectCode, code).then((res: any) => {
      if (res.dagData) {
        setReadonly(res.dagData.processDefinition.releaseState === "ONLINE");
        setDefinition(res.dagData);
      }
    });
  };

  const refresh = () => {
    getDefinition();
  };

  useMount(() => {
    getDefinition();
  });

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

    updateProcessDefinition(
      {
        taskDefinitionJson: JSON.stringify(taskDefinitions),
        taskRelationJson: JSON.stringify(connects),
        locations: JSON.stringify(locations),
        name: saveForm.name,
        executionType: saveForm.executionType,
        description: saveForm.description,
        globalParams: JSON.stringify(globalParams),
        timeout: saveForm.timeoutFlag ? saveForm.timeout : 0,
        releaseState: saveForm.release ? "ONLINE" : "OFFLINE",
      },
      code,
      projectCode
    ).then(() => {
      message.success("保存成功");
      navigate(-1);
    });
  };

  return (
    <div className="w-full h-full p-5 bg-white rounded-lg">
      <Dag
        projectCode={projectCode}
        code={code}
        onSave={onSave}
        readonly={readonly}
        definition={definition}
        onRefresh={refresh}
      />
    </div>
  );
}
