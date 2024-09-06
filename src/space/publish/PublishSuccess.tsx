import { PUBLICURL } from "@transquant/constants";
import { Empty } from "antd";

export default function PublishSuccess() {
  return (
    <Empty
      image={`${PUBLICURL}/images/Done.svg`}
      className="flex flex-col items-center justify-center"
      description="申请提交成功"
    />
  );
}
