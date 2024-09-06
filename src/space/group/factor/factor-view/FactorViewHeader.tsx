import { Descriptions, Tag } from "antd";
import { observer } from "mobx-react";
import { useStores } from "../../../hooks";

export default observer(function FactorViewHeader() {
  const { factorBaseInfo } = useStores().groupFactorStore;

  return (
    <Descriptions>
      <Descriptions.Item label="类名">
        {factorBaseInfo?.className}
      </Descriptions.Item>
      <Descriptions.Item label="修改时间">
        {factorBaseInfo?.srcUpdateTime}
      </Descriptions.Item>
      <Descriptions.Item label="标签">
        {factorBaseInfo?.tags.map((label) => (
          <Tag key={label.id} bordered={false}>
            {label.name}
          </Tag>
        ))}
      </Descriptions.Item>
    </Descriptions>
  );
});
