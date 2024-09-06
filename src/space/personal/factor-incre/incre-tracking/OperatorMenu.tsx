import { MoreOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { paths } from "@transquant/constants";
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
import PreRun from "src/space/pre-run";
import { useStores } from "../../../hooks";
import { Job } from "../../../types";

interface OperatorMenuProps {
  data: DataType<Job>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const {
    updateQuartzJobTags,
    endQuartzJob,
    deleteQuartzJob,
    onCurrentJobChange,
    startQuartzJob,
  } = useStores().factorResearchStore;
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
    updateQuartzJobTags({ id: data.id, tags: labelNames });

    setLabelVisible(false);
  };

  const onView = () => {
    onCurrentJobChange(data);
    navigate(`${paths.factor}/${data.id}`);
  };

  const items: MenuProps["items"] = [
    {
      key: "preRun",
      label: "试运行",
      disabled: !getAccess("B030114"),
    },
    {
      key: "configTag",
      label: "设置标签",
      disabled: !getAccess("B030115"),
    },
    {
      key: "delete",
      label: "删除",
      disabled: !getAccess("B030116"),
    },
  ];

  const onDelete = () => {
    Modal.confirm({
      title: "是否确认删除该策略增量回测",
      content: "该操作将一并删除该增量任务及相关数据！",
      onOk: () => {
        deleteQuartzJob(data.id);
      },
    });
  };

  const onFinish = () => {
    Modal.confirm({
      title: "是否确认结束该策略增量回测",
      content: "结束后该增量任务将停止运行！",
      onOk: () => {
        endQuartzJob(data.id);
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
        <Permission code="B030111" disabled>
          <Tooltip title="查看详情">
            <Typography.Link onClick={onView}>
              <IconFont type="chakanxiangqing" />
            </Typography.Link>
          </Tooltip>
        </Permission>
        <Divider type="vertical" />
        <Permission code="B030112" disabled>
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
        <Permission code="B030113" disabled>
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
          value={labels || []}
          visible={labelVisible}
          onVisibleChange={(value: boolean) => setLabelVisible(value)}
          onChange={onLabelConfigChange}
          onOk={onLabelConfigOk}
        />
      </When>
      {preRunVisible && (
        <PreRun
          jobId={data.quartzJobId}
          visible={preRunVisible}
          onVisibleChange={setPreRunVisible}
        />
      )}
    </>
  );
});
