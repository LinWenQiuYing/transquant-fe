import { TagsOutlined } from "@ant-design/icons";
import { paths } from "@transquant/constants";
import { IconFont, LabelConfig, Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Divider, Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { When } from "react-if";
import { useNavigate } from "react-router-dom";
import { useStores } from "../../../hooks";
import { Job } from "../../../types";
import { StrategyLibItem } from "../../../types/strategy";

interface OperatorMenuProps {
  data: DataType<StrategyLibItem>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const { updateFactorTags, onCurrentJobChange } =
    useStores().strategyResearchStore;
  const [labelVisible, setLabelVisible] = useState<boolean>(false);
  const [labels, setLabels] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    setLabels(data.tags?.map((item) => `${item.id}`));
  }, [data.tags]);

  const onLabelConfigChange = (value: string[]) => {
    setLabels(value);
  };

  const onLabelConfigOk = (labelNames: string[]) => {
    updateFactorTags({ id: data.id, tags: labelNames });

    setLabelVisible(false);
  };

  const onView = () => {
    const [startTime, endTime] = data.timeRange.split("~");
    onCurrentJobChange({
      jobKey: `${data.id}`,
      name: data.name,
      className: data.className,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      analysisFlag: data.analysisFlag,
      performanceFlag: data.performanceFlag,
    } as DataType<Job> & { endTime: string });
    navigate(
      `${paths.strategy}/${data.id}?performanceFlag=${data.performanceFlag}`
    );
  };

  return (
    <>
      <Space>
        <Permission code="B030209" disabled>
          <Tooltip title="查看详情">
            <Typography.Link onClick={onView}>
              <IconFont type="chakanxiangqing" />
            </Typography.Link>
          </Tooltip>
        </Permission>
        <Divider type="vertical" />
        <Permission code="B030210" disabled>
          <Tooltip title="设置标签">
            <Typography.Link onClick={() => setLabelVisible(true)}>
              <TagsOutlined />
            </Typography.Link>
          </Tooltip>
        </Permission>
      </Space>
      <When condition={labelVisible}>
        <LabelConfig
          value={labels || []}
          visible={labelVisible}
          onVisibleChange={(value: boolean) => setLabelVisible(value)}
          onChange={onLabelConfigChange}
          onOk={onLabelConfigOk}
        />
      </When>
    </>
  );
});
