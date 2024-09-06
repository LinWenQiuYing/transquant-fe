import { StepsProps } from "antd";
import { useState } from "react";

export default function useSteps() {
  const [current, setCurrent] = useState(0);

  const items: StepsProps["items"] = [
    {
      title: "基础信息",
    },
    {
      title: "角色选择",
    },
    {
      title: "成员选择",
    },
  ];

  const onStepChange = (current: number) => {
    setCurrent(current);
  };

  return { items, current, onStepChange };
}
