import { AForm, AFormProps } from "@transquant/ui";
import { ajax } from "@transquant/utils";
import { useMount, useUnmount } from "ahooks";
import { Form, Modal } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import { useMemo, useRef, useState } from "react";
import { useStores } from "../hooks";
import { SimpleUser } from "../types";
import { NodeConfig as NodeConfigType } from "../types/environment";
import NodeConfig from "./NodeConfig";

interface ResourceQuotaModalProps {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export type FormValueType = {
  enable: boolean;
  type: number;
  envLimit?: number;
  gpuLimit?: number;
  memLimit?: number;
  cpuLimit?: number;
  notifyUserIds?: number[];
  mails?: string;
  nodeConfig?: NodeConfigType[];
};

const ENABLE_OPTIONS = [
  {
    label: "是",
    value: true,
  },
  {
    label: "否",
    value: false,
  },
];
const TYPE_OPTIONS = [
  {
    label: "是",
    value: 0,
  },
  {
    label: "否",
    value: 1,
  },
];

const initialValues: Partial<FormValueType> = {
  enable: true,
  type: 1,
};

const getAllSimpleUsers = async () => {
  return await ajax<SimpleUser[]>({
    url: `/tquser/user/getAllSimpleUsers`,
  });
};

export default observer(function ResourceQuotaModal(
  props: ResourceQuotaModalProps
) {
  const { visible, onVisibleChange } = props;
  const { persistResourceQuota, quotaData, resetQuotaData } =
    useStores().environmentStore;

  const [form] = Form.useForm();
  const [allUsers, setAllUsers] = useState<SimpleUser[]>([]);
  const nodeConfigRef = useRef<{ nodeConfig: NodeConfigType[] }>(null);

  useUnmount(() => {
    resetQuotaData();
  });

  useMount(async () => {
    const users = await getAllSimpleUsers();

    setAllUsers(users);
  });

  const onCancel = () => onVisibleChange(false);

  const onOk = () => {
    const nodeConfig = nodeConfigRef.current?.nodeConfig;
    form.validateFields().then((values) => {
      const {
        notifyUserIds,
        cpuLimit,
        enable,
        envLimit,
        gpuLimit,
        mails,
        memLimit,
        type,
      } = values;
      const result = {
        enable,
        type,
        mails,
        notifyUserIds,
        unifiedConfig: {
          cpuLimit,
          envLimit,
          gpuLimit,
          memLimit,
        },
        nodeConfig,
      };
      persistResourceQuota(result).then(() => {
        onVisibleChange(false);
      });
    });
  };

  const _initailValues = useMemo(() => {
    if (!quotaData) return initialValues;
    const { notifyUserIds, unifiedConfig } = quotaData;

    return {
      ...initialValues,
      ...quotaData,
      notifyUserIds:
        notifyUserIds.length === 0 ? undefined : toJS(notifyUserIds),
      ...unifiedConfig,
    };
  }, [quotaData]);

  const config: AFormProps<FormValueType>["config"] = {
    preserve: false,
    initialValues: _initailValues,
    layout: "vertical",
  };

  const json: AFormProps<FormValueType>["json"] = [
    {
      name: "enable",
      type: "radio",
      label: "资源预占上限配置",
      tooltip:
        "配置资源预占上限后，当该节点相应指标超过上限时，该指标标红，且将不予在该节点上新增环境。",
      options: ENABLE_OPTIONS,
    },
    {
      name: "type",
      label: "节点统一配置",
      tooltip: "支持对部分指标进行限制，如未填写该指标，则代表该指标不进行限制",
      type: "radio",
      options: TYPE_OPTIONS,
      validateFn: (values) => values.enable,
    },
    {
      name: "envLimit",
      label: "环境个数上限",
      type: "input-number",
      props: {
        placeholder: "请输入环境个数上限",
        suffix: "个",
      },
      validateFn: (values) => values.enable && values.type === 0,
    },
    {
      name: "gpuLimit",
      label: "GPU预占比例上限",
      type: "input-number",
      props: {
        placeholder: "请输入GPU预占比例上限",
        suffix: "%",
      },
      validateFn: (values) => values.enable && values.type === 0,
    },
    {
      name: "memLimit",
      label: "内存预占比例上限",
      type: "input-number",
      props: {
        placeholder: "请输入内存预占比例上限",
        suffix: "%",
      },
      validateFn: (values) => values.enable && values.type === 0,
    },
    {
      name: "cpuLimit",
      label: "CPU预占比例上限",
      type: "input-number",
      props: {
        placeholder: "请输入CPU预占比例上限",
        suffix: "%",
      },
      validateFn: (values) => values.enable && values.type === 0,
    },
    {
      name: "nodeConfig",
      type: "custom",
      children: (
        <NodeConfig
          ref={nodeConfigRef}
          data={_initailValues.nodeConfig || []}
        />
      ),
      validateFn: (values) => {
        return values.enable && values.type === 1;
      },
    },
    {
      name: "notifyUserIds",
      label: "消息推送",
      type: "select",
      props: {
        placeholder: "请选择用户",
        mode: "multiple",
      },
      validateFn: (values) => values.enable,
      options: allUsers.map((user) => ({
        label: user.realName,
        value: user.id,
      })),
    },
    {
      name: "mails",
      label: "邮箱通知",
      type: "input",
      props: {
        placeholder: "请输入邮箱，多个邮箱地址则用逗号分隔",
      },
      validateFn: (values) => values.enable,
    },
  ];

  return (
    <Modal
      title="资源预占限制管理"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      width={800}
      destroyOnClose
    >
      <AForm form={form} config={config} json={json} />
    </Modal>
  );
});
