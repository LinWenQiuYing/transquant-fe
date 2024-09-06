import { ajax } from "@transquant/utils";
import { useMount } from "ahooks";
import { Modal, Select, SelectProps } from "antd";
import { useEffect, useState } from "react";
import { Label } from "../input-group";

interface LabelConfigProps {
  type?: "personal" | "communal";
  value: string[];
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  onChange: (value: string[]) => void;
  onOk: (value: string[]) => void;
  teamId?: number | undefined;
}

export default function LabelConfig(props: LabelConfigProps) {
  const {
    visible,
    onVisibleChange,
    value,
    onChange,
    type = "personal",
    teamId,
  } = props;

  const [options, setOptions] = useState<Label[]>([]);
  const [names, setNames] = useState<string[]>([]);

  useMount(async () => {
    const uri = type === "personal" ? "getTags" : "getTeamTags";
    const labels = await ajax({
      url: `/tqlab/tag/${uri}`,
      params: type === "communal" && {
        teamId,
      },
    });
    setOptions(labels);
  });

  useEffect(() => {
    const names: string[] = [];
    value.forEach((v) => {
      const name = options.find((item) => item.id === +v)?.name || v;
      names.push(`${name}`);
    });
    setNames(names);
  }, [value, options]);

  const onSelectChange: SelectProps["onChange"] = (_value, option) => {
    const labelNames = option.map((item: any, index: number) =>
      item.label ? item.label : _value[index]
    );
    onChange(_value);
    setNames(labelNames);
  };

  const onCancel = () => {
    onVisibleChange(false);
  };

  const onOk = () => {
    props.onOk(names);
  };

  return (
    <Modal
      title="标签设置"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose
    >
      <Select
        placeholder="请选择搜索标签"
        mode="tags"
        tokenSeparators={[","]}
        style={{ width: "100%" }}
        value={value}
        onChange={onSelectChange}
        options={options.map((item) => ({
          value: `${item.id}`,
          label: item.name,
        }))}
      />
    </Modal>
  );
}
