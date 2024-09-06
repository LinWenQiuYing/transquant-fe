import { Steps as AntdSteps } from "antd";
import useSteps from "./use-steps";

export default function Steps(props: ReturnType<typeof useSteps>) {
  const { items, current } = props;

  return <AntdSteps current={current} items={items} />;
}
