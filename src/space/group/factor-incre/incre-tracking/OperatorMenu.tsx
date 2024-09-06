import { MoreOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { paths } from "@transquant/constants";
import PreRun from "@transquant/space/pre-run";
import { getAccess, IconFont, LabelConfig, Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import {
  Divider,
  Dropdown,
  MenuProps,
  Modal,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { observer } from "mobx-react";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { useEffect, useState } from "react";
import { When } from "react-if";
import { useNavigate } from "react-router-dom";
import { useStores } from "../../../hooks";
import { Job } from "../../../types";

interface OperatorMenuProps {
  data: DataType<Job>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const {
    updateQuartzTeamJobTags,
    endQuartzTeamJob,
    deleteQuartzTeamJob,
    onCurrentJobChange,
    selectedTeam,
    startQuartzJob,
  } = useStores().groupFactorStore;
  const [labelVisible, setLabelVisible] = useState<boolean>(false);
  const [preRunVisible, setPreRunVisible] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    setLabels(data.tags?.map((item) => `${item.id}`));
  }, [data.tags]);

  const onLabelConfigChange = (value: string[]) => {
    setLabels(value);
  };

  const onLabelConfigOk = (labelNames: string[]) => {
    updateQuartzTeamJobTags({ id: data.id, tags: labelNames });

    setLabelVisible(false);
  };

  const onView = () => {
    onCurrentJobChange(data);
    navigate(`${paths.groupFactor}/incre_group/${data.id}`);
  };

  const items: MenuProps["items"] = [
    {
      key: "preRun",
      label: "试运行",
      disabled: !getAccess("B040112"),
    },
    {
      key: "configTag",
      label: "设置标签",
      disabled: !getAccess("B040113"),
    },
    {
      key: "delete",
      label: "删除",
      disabled: !getAccess("B040114"),
    },
  ];

  const onDelete = () => {
    Modal.confirm({
      title: "是否确认删除该策略增量回测",
      content: "该操作将一并删除该增量任务及相关数据！",
      onOk: () => {
        deleteQuartzTeamJob(data.id);
      },
    });
  };

  const onFinish = () => {
    Modal.confirm({
      title: "是否确认结束该策略增量回测",
      content: "结束后该增量任务将停止运行！",
      onOk: () => {
        endQuartzTeamJob(data.id);
      },
    });
  };

  const onItemClick: MenuClickEventHandler = async (info) => {
    switch (info.key) {
      case "preRun":
        setPreRunVisible(true);
        break;
      case "configTag":
        setLabelVisible(true);
        break;
      case "delete":
        onDelete();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Space>
        <Permission code="B040109" disabled>
          <Tooltip title="查看详情">
            <Typography.Link onClick={onView}>
              <IconFont type="chakanxiangqing" />
            </Typography.Link>
          </Tooltip>
        </Permission>
        <Divider type="vertical" />
        <Permission code="B040110" disabled>
          <Tooltip title="启动">
            <Typography.Link
              disabled={data.runStatus === 0}
              onClick={() => startQuartzJob(data.quartzJobId)}
            >
              <PlayCircleOutlined />
            </Typography.Link>
          </Tooltip>
        </Permission>
        <Divider type="vertical" />
        <Permission code="B040111" disabled>
          <Tooltip title="结束">
            <Typography.Link onClick={() => onFinish()}>
              <IconFont type="shutdown" />
            </Typography.Link>
          </Tooltip>
        </Permission>
        <Divider type="vertical" />
        <Tooltip title="更多">
          <Dropdown menu={{ items, onClick: onItemClick }}>
            <Typography.Link>
              <MoreOutlined style={{ rotate: "90deg" }} />
            </Typography.Link>
          </Dropdown>
        </Tooltip>
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
      {preRunVisible && (
        <PreRun
          type="team"
          jobId={data.quartzJobId}
          visible={preRunVisible}
          onVisibleChange={setPreRunVisible}
        />
      )}
    </>
  );
});
