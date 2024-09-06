import { useUnmount } from "ahooks";
import { Button, Modal, Steps } from "antd";
import { observer } from "mobx-react";
import { useRef, useState } from "react";
import { useStores } from "../hooks";
import FactorResultList from "./FactorResultList";
import "./index.less";
import PublishInfo, { PublishInfoState } from "./PublishInfo";
import PublishSuccess from "./PublishSuccess";
import SelectTeam, { SelectTeamState } from "./SelectTeam";
import StrategyResultList from "./StrategyResultList";

interface PublishModalProps {
  title?: string;
  projectId: number;
  type: 0 | 1; // 0 因子 1 策略
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export enum StepEnum {
  SelectTeam,
  PublishInfo,
  ContentSure,
  Success,
}

export default observer(function PublishModal(props: PublishModalProps) {
  const {
    title = "发布因子项目",
    type,
    visible,
    onVisibleChange,
    projectId,
  } = props;
  const { getFactorResultListByProjectId } = useStores().factorResearchStore;
  const { getStrategyResultListByProjectId } =
    useStores().strategyResearchStore;
  const {
    getPersonalFolder,
    checkBeforePublish,
    getUserListByTeam,
    getTeamTags,
    publish,
    publishLoading,
    onReset,
  } = useStores().publishStore;

  const [currentIndex, setCurrentIndex] = useState(0);
  const selectTeamRef = useRef<{ validate: () => SelectTeamState }>(null);
  const publishInfoRef = useRef<{ validate: () => PublishInfoState }>(null);

  const [publishState, setPublishState] = useState<
    Partial<SelectTeamState> & Partial<PublishInfoState>
  >({});

  useUnmount(() => {
    onReset();
  });

  const steps = [
    {
      key: StepEnum.SelectTeam,
      title: "选择发布团队",
      content: <SelectTeam ref={selectTeamRef} data={publishState} />,
    },
    {
      key: StepEnum.PublishInfo,
      title: "填写发布信息",
      content: (
        <PublishInfo
          ref={publishInfoRef}
          data={publishState}
          type={type}
          projectId={projectId}
        />
      ),
    },
    {
      key: StepEnum.ContentSure,
      title: "发布内容确定",
      content: type === 0 ? <FactorResultList /> : <StrategyResultList />,
    },
    {
      key: StepEnum.Success,
      title: "提交",
      content: <PublishSuccess />,
    },
  ];

  const onPrev = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const handleSelectTeam = async () => {
    const data = await selectTeamRef.current?.validate();
    if (!data) return;

    await checkBeforePublish({ ...data, type });

    // 验证通过，保存state
    setPublishState({ ...publishState, ...data });

    // 调用接口获取下一页所需数据
    await getPersonalFolder({ type, projectId, path: "" });
    await getUserListByTeam(data.teamId);
    await getTeamTags(data.teamId!);

    // 跳转下一页
    setCurrentIndex(currentIndex + 1);
  };

  const handlePublishInfo = async () => {
    const data = await publishInfoRef.current?.validate();
    if (!data) return;

    // 保存数据
    setPublishState({ ...publishState, ...data });

    if (type === 0) {
      // 因子发布
      await getFactorResultListByProjectId(projectId);
    } else {
      await getStrategyResultListByProjectId(projectId);
    }

    // 跳转下一页
    setCurrentIndex(currentIndex + 1);
  };

  const onNext = async () => {
    if (currentIndex === StepEnum.SelectTeam) {
      await handleSelectTeam();
    }
    if (currentIndex === StepEnum.PublishInfo) {
      await handlePublishInfo();
    }

    setCurrentIndex(currentIndex + 1);
  };

  const onPublish = async () => {
    await publish({ ...publishState, type, sourceProjectId: projectId });
    setCurrentIndex(currentIndex + 1);
  };

  const getFooter = () => {
    const stepsLenght = steps.length;
    const footer: React.ReactNode[] = [];

    if (currentIndex > 0) {
      const el = (
        <Button type="primary" onClick={onPrev} key="prev">
          上一步
        </Button>
      );
      footer.push(el);
    }

    if (currentIndex < stepsLenght - 2) {
      const el = (
        <Button type="primary" onClick={onNext} key="next">
          下一步
        </Button>
      );
      footer.push(el);
    }

    if (currentIndex === stepsLenght - 2) {
      const el = (
        <Button
          type="primary"
          key="pub"
          onClick={onPublish}
          loading={publishLoading}
        >
          提交
        </Button>
      );
      footer.push(el);
    }

    if (currentIndex === stepsLenght - 1) {
      footer.length = 0;
    }

    return footer;
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={() => onVisibleChange(false)}
      footer={getFooter()}
      width={800}
    >
      <Steps items={steps} current={currentIndex} />
      <div style={{ marginTop: 20 }}>{steps[currentIndex].content}</div>
    </Modal>
  );
});
