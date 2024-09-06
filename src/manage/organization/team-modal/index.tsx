import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Tooltip } from "antd";
import { useMemo, useState } from "react";
import { Team } from "../../types";
import Base from "./Base";
import Member from "./Member";
import Role from "./Role";
import Steps from "./Steps";
import useBase, { BaseState } from "./use-base";
import useMember from "./use-member";
import useRole from "./use-role";
import useSteps from "./use-steps";

interface MergeTeamModalProps {
  id: number;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  type: "merge" | "split";
  title?: string;
  teams: Team[];
  loading: boolean;
  onSubmit: (values: Partial<BaseState>) => Promise<void>;
}

export type State = {
  userRoleMap: Record<number, number>;
  roleIdList: number[];
} & BaseState;

export default function TeamModal(props: MergeTeamModalProps) {
  const {
    visible,
    onVisibleChange,
    type,
    title = "合并团队",
    id,
    teams,
    onSubmit,
    loading,
  } = props;
  const stepsState = useSteps();
  const baseState = useBase({ id, teams, type });
  const roleState = useRole({
    type,
    startTeamId: id,
    current: stepsState.current,
    otherTeamId: baseState.formValues.otherTeamId,
  });
  const memberState = useMember({
    type,
    startTeamId: id,
    current: stepsState.current,
    selectedRoles: roleState.selectedRoles,
    otherTeamId: baseState.formValues.otherTeamId,
  });
  const [state, setState] = useState<Partial<State>>({});

  const tooltip = useMemo(() => {
    const mergeTooltip =
      "合并成功后，新团队将出现在当前已选团队的同级目录下，原有团队仍保留。原团队如不需要请手动删除！";
    const splitTooltip =
      "当前团队将被拆分为当前团队与【新团队】，拆分完成后，【新团队】将在当前团队的同级目录下。";
    return type === "merge" ? mergeTooltip : splitTooltip;
  }, [type]);

  const onCancel = () => {
    onVisibleChange(false);
  };

  const onOk = () => {
    const userRoleMap = memberState.getUserRoleMap();
    const allValues = { ...state, userRoleMap };

    onSubmit(allValues).then(() => {
      onVisibleChange(false);
    });

    setState(allValues);
  };

  const getFooter = () => {
    const { current, onStepChange } = stepsState;

    const onNext = async () => {
      if (current === 0) {
        await baseState.form.validateFields();
        const baseValues = await baseState.form.validateFields();
        setState((state) => ({ ...state, ...baseValues }));
      }
      if (current === 1) {
        const roleIdList = roleState.selectedRoles.map((role) => role.id);
        setState((state) => ({ ...state, roleIdList }));
      }

      onStepChange(current + 1);
    };

    const prev = (
      <Button
        type="primary"
        onClick={() => onStepChange(current - 1)}
        key="prev"
      >
        上一步
      </Button>
    );
    const next = (
      <Button type="primary" onClick={onNext} key="next">
        下一步
      </Button>
    );

    const submit = (
      <Button type="primary" onClick={onOk} key="ok" loading={loading}>
        提交
      </Button>
    );

    const footers: React.ReactNode[] = [[next], [prev, next], [prev, submit]];

    return footers[current];
  };

  const views = [
    <Base {...baseState} key="base" />,
    <Role {...roleState} key="roles" />,
    <Member {...memberState} key="member" />,
  ];

  return (
    <Modal
      title={
        <div>
          <span className="mr-2">{title}</span>
          <Tooltip title={tooltip}>
            <QuestionCircleOutlined className="text-gray-400" />
          </Tooltip>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={1200}
      footer={getFooter()}
    >
      <div className="flex flex-col gap-y-6">
        <Steps {...stepsState} />
        {views[stepsState.current]}
      </div>
    </Modal>
  );
}
