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
import { GroupFactorLibItem } from "../../../types";

interface OperatorMenuProps {
  data: DataType<GroupFactorLibItem>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const { updateTeamFactorTags, selectedTeam } = useStores().groupFactorStore;
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
    updateTeamFactorTags({ id: data.id, tags: labelNames });

    setLabelVisible(false);
  };

  const onView = () => {
    navigate(
      `${paths.groupFactor}/${data.id}?performanceFlag=${data.performanceFlag}`
    );
  };

  return (
    <>
      <Space>
        <Permission code="B040108" disabled>
          <Tooltip title="查看详情">
            <Typography.Link onClick={onView}>
              <IconFont type="chakanxiangqing" />
            </Typography.Link>
          </Tooltip>
        </Permission>
        <Divider type="vertical" />
        <Permission code="B040115" disabled>
          <Tooltip title="设置标签">
            <Typography.Link onClick={() => setLabelVisible(true)}>
              <TagsOutlined />
            </Typography.Link>
          </Tooltip>
        </Permission>
      </Space>
      <When condition={labelVisible}>
        <LabelConfig
          type="communal"
          teamId={selectedTeam.id}
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
