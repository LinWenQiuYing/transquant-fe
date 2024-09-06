import { nameReg, nameRegMessage } from "@transquant/constants";
import { Form, Input, Modal, Select } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../hooks";
import { Image, ShareItem, TemplateItem, UserItem } from "../types";

interface ShareModalProps {
  title?: string;
  data?: ShareItem;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export type ShareSpaceValue = {
  imageId: number;
  envTemplateId: number;
  name: string;
  remark: string;
  teamId: number;
  templateId: number;
  userIdList: number[];
};

const defaultFormValues: Partial<ShareSpaceValue> = {};

const getUserList = (users: UserItem[]) => {
  return users.map((item) => ({
    label: item.realName,
    value: item.id,
  }));
};

const getImageOptions = (imageInstances: Image[]) => {
  return imageInstances.map((item) => ({
    label: item.name,
    value: item.id,
  }));
};

const getTemplateList = (templates: TemplateItem[]) => {
  return templates.map((item) => ({
    label: item.name,
    value: item.id,
  }));
};

export default observer(function ShareModal(props: ShareModalProps) {
  const { visible, onVisibleChange, title = "新建协作空间", data } = props;
  const {
    createShareSpace,
    editShareSpace,
    currentTeamId,
    userList,
    imageList,
    templates,
    envTemplates,
  } = useStores().shareStore;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const isEdit = "data" in props;

  const [form] = Form.useForm();
  const [formValues, setFormValues] =
    useState<Partial<ShareSpaceValue>>(defaultFormValues);

  useEffect(() => {
    const newFormValues = {
      ...data,
      userIdList: data?.userList.map((item) => item.id),
    };
    setFormValues(newFormValues);
    form.setFieldsValue(newFormValues);
  }, [data]);

  const onFormValueChange = (value: any) => {
    setFormValues({ ...formValues, ...value });
  };

  const onOk = async () => {
    form.validateFields().then(async () => {
      setConfirmLoading(true);
      if (isEdit) {
        await editShareSpace({
          ...defaultFormValues,
          ...formValues,
          teamId: currentTeamId,
          shareId: data!.id,
        });
      } else {
        await createShareSpace({
          ...defaultFormValues,
          ...formValues,
          teamId: currentTeamId,
        });
      }
      setConfirmLoading(false);
      onVisibleChange(false);
    });
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={() => onVisibleChange(false)}
      destroyOnClose
      width={500}
      onOk={onOk}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        preserve={false}
        layout="vertical"
        initialValues={formValues}
        onValuesChange={onFormValueChange}
      >
        <Form.Item
          name="name"
          label="空间名称"
          rules={[
            {
              required: true,
              message: nameRegMessage,
              pattern: nameReg,
            },
          ]}
        >
          <Input
            disabled={isEdit}
            placeholder="请输入空间名称"
            maxLength={30}
          />
        </Form.Item>
        <Form.Item
          name="userIdList"
          label="空间成员"
          rules={[
            {
              required: true,
              message: "请选择空间成员",
            },
          ]}
        >
          <Select
            options={getUserList(userList)}
            placeholder="请选择空间成员"
            mode="multiple"
          />
        </Form.Item>
        <Form.Item
          name="imageId"
          label="镜像选择"
          rules={[
            {
              required: true,
              message: "请选择镜像",
            },
          ]}
        >
          <Select
            disabled={isEdit}
            options={getImageOptions(imageList)}
            placeholder="请选择环境"
          />
        </Form.Item>
        <Form.Item label="资源配置" name="envTemplateId">
          {!isEdit ? (
            <Select
              placeholder="请选择资源模版"
              disabled={isEdit}
              options={envTemplates.map((item) => ({
                label: `${item.name},内存上限（${item.memLimit}M），CPU上限（${item.cpuLimit}Core），GPU（${item.gpuNum}G）`,
                value: item.id,
              }))}
            />
          ) : (
            <Input
              defaultValue={`${data?.name},内存上限（${data?.cpuMemLimit}M），CPU上限（${data?.cpuCoreLimit}Core），GPU（${data?.gpuCore}G）`}
              disabled
            />
          )}
        </Form.Item>
        {/* <Form.Item label="内存上限（M）" className="compact-form-item">
          <Row justify="space-between">
            <Col span={24}>
              <Form.Item name="cpuMemLimit">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="请输入内存最大值"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="CPU上限（Core）" className="compact-form-item">
          <Row justify="space-between">
            <Col span={24}>
              <Form.Item name="cpuCoreLimit">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="请输入CPU最大值"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          name="gpuCore"
          label="GPU"
          rules={[
            {
              required: true,
              message: "请输入GPU",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="请输入GPU" />
        </Form.Item> */}
        <Form.Item name="templateId" label="模版选择">
          <Select
            disabled={isEdit}
            options={getTemplateList(templates)}
            placeholder="请选择模版"
          />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea placeholder="请输入备注" maxLength={100} />
        </Form.Item>
      </Form>
    </Modal>
  );
});
