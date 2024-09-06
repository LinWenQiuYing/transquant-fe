import { MoreOutlined, SaveOutlined } from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import { Nullable } from "@transquant/utils";
import useMount from "ahooks/lib/useMount";
import {
  Button,
  Col,
  Descriptions,
  List,
  Popover,
  Row,
  Space,
  Steps,
  StepsProps,
  Tag,
} from "antd";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useStores } from "../../hooks";
import { ApprovalInfo, ApprovalStatus, LogEvent } from "../../types";
import { LogItem } from "../../types/publish";
import { CategoryEmum } from "../approve-record";
import DeployModal from "./DeployModal";

// 0 审核中 1 已通过 2 未通过

enum EApprovalStatus {
  "审核中",
  "已通过",
  "驳回",
}

const auditorStatus = {
  "1": {
    text: "已通过",
    color: "var(--green-600)",
  },
  "2": {
    text: ' "未通过"',
    color: "var(--red-600)",
  },
  "99": {
    text: "审核中",
    color: "var(--blue-400)",
  },
  "100": {
    text: "待审核",
    color: "var(--grey-400)",
  },
};

const FlowStep = (props: { approvalInfo: Nullable<ApprovalInfo> }) => {
  const { approvalInfo } = props;
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const [lineWidth, setLineWidth] = useState(0);

  const getTitle = (orderStatus: ApprovalStatus = 0) => {
    let title = "待审核";
    let icon = <IconFont type="daishenhe" />;
    switch (orderStatus) {
      case 0:
        title = "审核中";
        icon = <IconFont type="shenhezhong" />;
        break;
      case 1:
        title = "已通过";
        icon = <IconFont type="shenhetongguo" />;
        break;
      case 2:
        title = "未通过";
        icon = <IconFont type="weitongguo" />;
        break;
      default:
        break;
    }

    return { title, icon };
  };

  useEffect(() => {
    if (ref1.current && ref2.current) {
      const interval = ref2.current.offsetLeft - ref1.current.offsetLeft - 200;

      setLineWidth(interval);
    }
  }, []);

  const PopoverEl = (
    <List
      size="small"
      bordered={false}
      dataSource={approvalInfo?.auditorBlock}
      renderItem={(item) => (
        <List.Item>
          <Row style={{ width: 300 }}>
            <Col span={6}>{item.auditor}</Col>
            <Col
              span={6}
              style={{ color: auditorStatus[item.auditorStatus].color }}
            >
              {auditorStatus[item.auditorStatus].text}
            </Col>
            <Col span={12} style={{ color: "var(--grey-400)" }}>
              {item.auditTime}
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );

  return (
    <Row className={`${clsPrefix}-flow-step`} justify="space-between">
      <Col ref={ref1}>
        <div className="title">
          <IconFont type="tijiaoshenqing" />
          <span>提交申请</span>
        </div>
        <p>{approvalInfo?.publisher}</p>
        <span className="time">{approvalInfo?.publishTime}</span>
      </Col>
      <div
        className="interval-line"
        style={{
          width: lineWidth,
          left: 200 + 24,
        }}
      />
      <Popover content={approvalInfo?.auditorBlock.length ? PopoverEl : null}>
        <Col
          ref={ref2}
          className={classNames({
            pending: approvalInfo?.status === 0,
            success: approvalInfo?.status === 1,
            error: approvalInfo?.status === 2,
          })}
        >
          <div className="title">
            {getTitle(approvalInfo?.status).icon}
            <span>{getTitle(approvalInfo?.status).title}</span>
            <Tag style={{ float: "right" }} bordered={false}>
              {CategoryEmum[approvalInfo?.category || 0]}
            </Tag>
          </div>
          {approvalInfo?.auditorBlock.length ? (
            <p>
              {`${approvalInfo?.auditorBlock[0]?.auditor}等${approvalInfo?.auditorBlock.length}人`}
            </p>
          ) : null}
          <span className="time">{approvalInfo?.auditTime}</span>
        </Col>
      </Popover>
      <div
        className="interval-line"
        style={{
          width: lineWidth,
          left: 200 + 200 + 24 + +lineWidth,
        }}
      />
      <Col
        className={classNames({
          pending: approvalInfo?.status === 0,
          success: approvalInfo?.status === 1,
          error: approvalInfo?.status === 2,
        })}
      >
        <div className="title">
          <IconFont type="ruku" />
          <span>入库</span>
        </div>
      </Col>
    </Row>
  );
};

const InfoView = (props: { approvalInfo: Nullable<ApprovalInfo> }) => {
  const { approvalInfo } = props;
  const [visible, setVisible] = useState(false);
  const params = useParams();
  const onSave = () => setVisible(true);

  return (
    <>
      <Descriptions
        title="发布信息"
        bordered
        size="small"
        extra={
          <Button
            type="link"
            onClick={onSave}
            icon={<SaveOutlined />}
            disabled={!params.type}
          >
            文件保存
          </Button>
        }
      >
        <Descriptions.Item label="项目名称">
          {approvalInfo?.projectName}
        </Descriptions.Item>
        <Descriptions.Item label="项目类型">
          <Tag
            color={approvalInfo?.type === 0 ? "blue" : "red"}
            bordered={false}
          >
            {approvalInfo?.type === 0 ? "因子" : "策略"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="项目标签">
          {approvalInfo && (
            <div style={{ display: "flex", flexWrap: "nowrap" }}>
              {approvalInfo?.tags?.map((tag) => {
                return (
                  <Tag bordered={false} key={tag}>
                    {tag}
                  </Tag>
                );
              })}
              {approvalInfo?.tags && approvalInfo?.tags?.length > 3 && (
                <Popover
                  content={
                    <Space style={{ width: 300 }} wrap>
                      {approvalInfo?.tags?.map((item) => (
                        <Tag bordered={false} key={item}>
                          {item}
                        </Tag>
                      ))}
                    </Space>
                  }
                >
                  <MoreOutlined
                    style={{ transform: "rotate(90deg)", cursor: "pointer" }}
                  />
                </Popover>
              )}
            </div>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="发布团队">
          {approvalInfo?.targetTeam}
        </Descriptions.Item>
        <Descriptions.Item label="提交时间">
          {approvalInfo?.publishTime}
        </Descriptions.Item>
        <Descriptions.Item label="工单状态">
          <span
            className={classNames(`${clsPrefix}-status`, {
              success: approvalInfo?.status === EApprovalStatus.已通过,
              error: approvalInfo?.status === EApprovalStatus.驳回,
              pending: approvalInfo?.status === EApprovalStatus.审核中,
            })}
          >
            {EApprovalStatus[approvalInfo?.status || 0]}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="申请人">
          {approvalInfo?.publisher}
        </Descriptions.Item>
        <Descriptions.Item label="申请原因">
          {approvalInfo?.reason}
        </Descriptions.Item>
      </Descriptions>
      {visible && (
        <DeployModal
          title={approvalInfo?.type === 0 ? "新建因子项目" : "新建策略项目"}
          visible={visible}
          onVisibleChange={(value) => setVisible(value)}
          personalProjectName={approvalInfo?.projectName}
          processInstanceId={approvalInfo?.id}
        />
      )}
    </>
  );
};

const LogView = (props: { approvalInfo: Nullable<ApprovalInfo> }) => {
  const { approvalInfo } = props;

  const getActionEl = (action: LogEvent) => {
    let actionEl = <span />;

    switch (action) {
      case 0:
        actionEl = <span style={{ color: "var(--blue-400)" }}>（提交）</span>;
        break;
      case 1:
        actionEl = <span style={{ color: "var(--lime-600)" }}>（通过）</span>;
        break;
      case 2:
        actionEl = <span style={{ color: "var(--red-600)" }}>（驳回）</span>;
        break;
      case 3:
        actionEl = (
          <span style={{ color: "var(--orange-600)" }}>（权限修改）</span>
        );
        break;
      default:
        break;
    }

    return actionEl;
  };

  const getStepTitle = (log: LogItem) => {
    return (
      <Space className={`${clsPrefix}-step-title`}>
        <span>{log.logTime}</span>
        <Space>
          {log.realName}
          {getActionEl(log.event)}
        </Space>
      </Space>
    );
  };

  const getStepDescription = (log: LogItem) => {
    if (!log.comment) return null;

    return (
      <span className={`${clsPrefix}-step-description`}>{log.comment}</span>
    );
  };

  const customDot: StepsProps["progressDot"] = (dot) => {
    return <span>{dot}</span>;
  };

  return (
    <Steps
      progressDot={customDot}
      current={approvalInfo?.logs.length}
      direction="vertical"
    >
      {approvalInfo?.logs.map((log, index) => (
        <Steps.Step
          key={index}
          title={getStepTitle(log)}
          description={getStepDescription(log)}
        />
      ))}
    </Steps>
  );
};

export default observer(function PublishDetail() {
  const { approvalInfo, getApprovalDetail, getUserListByTeam } =
    useStores().publishStore;
  const params = useParams();

  useMount(() => {
    getApprovalDetail(params.id).then((data) => {
      getUserListByTeam(data.targetTeamId);
    });
  });

  return (
    <div className={`${clsPrefix}-publish-detail`}>
      <FlowStep approvalInfo={approvalInfo} />
      <InfoView approvalInfo={approvalInfo} />
      <div>
        <div
          style={{
            fontWeight: "bold",
            fontSize: 16,
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          备注信息
        </div>
        <LogView approvalInfo={approvalInfo} />
      </div>
    </div>
  );
});
