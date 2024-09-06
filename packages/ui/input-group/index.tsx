import { ajax } from "@transquant/utils";
import { Input, Select, Space } from "antd";
import { useState } from "react";
import { When } from "react-if";

const { Option } = Select;

export interface Label {
  id: number;
  name: string;
}

interface InputGroupProps {
  onChange: (value: [string, string[]]) => void;
  name?: string;
  mode?: "personal" | "team";
}

type SelectBeforeType = "name" | "label";

const getIds = (data: string[]) => {
  const ids = data.map((item) => {
    const [id] = item.split("-");

    return id;
  });

  return ids;
};

export default function InputGroup(props: InputGroupProps) {
  const { onChange, name = "名称", mode = "personal" } = props;

  const [type, setType] = useState<SelectBeforeType>("name");
  const [options, setOptions] = useState<Label[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectItems] = useState<string[]>([]);

  const onTypeChange = async (value: SelectBeforeType) => {
    if (value === "label") {
      const url =
        mode === "personal"
          ? `/tqlab/tag/getTagsByType`
          : `/tqlab/tag/getTagsByType`;
      // TimeLyre
      const labels = await ajax({ url, params: { resourceType: 4 } });

      setOptions(labels);
      setInputValue("");
    } else {
      setSelectItems([]);
    }

    setType(value);
  };

  const onInputChange = (value: string) => {
    const ids = getIds(selectedItems);

    onChange([value, ids]);
  };

  const onSelectChange = (value: string[]) => {
    setSelectItems(value);

    const ids = getIds(value);

    onChange([inputValue, ids]);
  };

  const filteredOptions = options.filter(
    (item) => !selectedItems.includes(`${item.id}`)
  );

  return (
    <Space.Compact style={{ width: "100%" }}>
      <Select value={type} onChange={onTypeChange}>
        <Option value="name">{`${name}`}</Option>
        <Option value="label">标签</Option>
      </Select>
      <When condition={type === "name"}>
        <Input.Search
          placeholder="请输入搜索关键字"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ width: "200px" }}
          onSearch={onInputChange}
        />
      </When>
      <When condition={type === "label"}>
        <Select
          mode="multiple"
          placeholder="请选择搜索标签"
          value={selectedItems as string[]}
          onChange={onSelectChange}
          style={{ width: "200px" }}
          options={filteredOptions.map((item) => ({
            value: `${item.id}-${item.name}`,
            label: item.name,
          }))}
        />
      </When>
    </Space.Compact>
  );
}
