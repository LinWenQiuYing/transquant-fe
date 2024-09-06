import { Descriptions, Tag } from "antd";
import { observer } from "mobx-react";
import { useStores } from "../../../hooks";

export default observer(function FactorViewHeader() {
  const { strategyBaseInfo } = useStores().strategyResearchStore;
  return (
    <Descriptions>
      <Descriptions.Item label="类名">
        {strategyBaseInfo?.className}
      </Descriptions.Item>
      <Descriptions.Item label="修改时间">
        {strategyBaseInfo?.srcUpdateTime}
      </Descriptions.Item>
      <Descriptions.Item label="标签">
        {strategyBaseInfo?.tags.map((label) => (
          <Tag bordered={false} key={label.id}>
            {label.name}
          </Tag>
        ))}
      </Descriptions.Item>
    </Descriptions>
  );
});
