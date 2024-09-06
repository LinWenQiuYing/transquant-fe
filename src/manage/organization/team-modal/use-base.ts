import { Form } from "antd";
import { useMemo, useState } from "react";
import { Team } from "../../types";

type Option = {
  id: number;
  teams: Team[];
  type: "merge" | "split";
};

export type BaseState = {
  startTeamId: number;
  otherTeamId: number;
  name: string;
  spaceName: string;
  dbName: string;
  contacter: string;
  contacterInfo: string;
  description: string;
};

export default function useBase(options: Option) {
  const { id, teams, type } = options;
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<Partial<BaseState>>({
    startTeamId: id,
  });

  const onFormValueChange = (values: any) => {
    setFormValues({ ...formValues, ...values });
  };

  const title = useMemo(() => {
    return type === "merge" ? "请选择需要合并的团队" : "请选择需要拆分的团队";
  }, [type]);

  const subTitle = useMemo(() => {
    return type === "merge" ? "新建合并后的团队" : "拆分后的团队";
  }, [type]);

  const backfillOptions = useMemo(() => {
    return teams.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [teams]);

  const filterOptions = useMemo(() => {
    return teams
      .filter((item) => item.id !== formValues.startTeamId)
      .map((item) => ({
        label: item.name,
        value: item.id,
      }));
  }, [teams]);

  return {
    form,
    teams,
    type,
    title,
    subTitle,
    formValues,
    onFormValueChange,
    backfillOptions,
    filterOptions,
  };
}
