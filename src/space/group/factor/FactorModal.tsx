import { clsPrefix } from "@transquant/constants";
import { DataType } from "@transquant/utils";
import { Form, Input, Modal, Select } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { When } from "react-if";

import { toJS } from "mobx";
import { useStores } from "../../hooks";
import { GroupProjectItem } from "../../types";

interface FactorModalProps<T> {
  title?: string;
  data?: T;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}
interface FormValueType {
  projectName: string;
  tags: string[];
  comment: string;
  ownerIdList: number[];
}

const defaultFormValues: FormValueType = {
  projectName: "",
  tags: [],
  comment: "",
  ownerIdList: [],
};

export default observer(function FactorModal<
  T extends DataType<GroupProjectItem>
>(props: FactorModalProps<T>) {
  const { title, visible, onVisibleChange, data } = props;
  const {
    allTags,
    teamTags,
    userList,
    downloadTeamFactorProject,
    updateTeamFactorProject,
  } = useStores().groupFactorStore;

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(defaultFormValues);
  const isEdit = title === "编辑因子项目";

  const onFormValueChange = (value: any) => {
    setFormValues({ ...formValues, ...value });
  };

  useEffect(() => {
    if (!data) return;
    if (isEdit) {
      const newValues = {
        comment: data.comment,
        projectName: data.name,
        tags: data.tags.map((item) => item.name),
        ownerIdList: toJS(data.ownerIdList) || [],
      };
      setFormValues(newValues);
      form.setFieldsValue(newValues);
    }
  }, [data, visible]);

  const onOk = async () => {
    form.validateFields().then(async (values) => {
      form.resetFields();
      if (isEdit) {
        await updateTeamFactorProject({
          ...values,
          projectId: data?.id,
        });
      } else {
        await downloadTeamFactorProject({
          ...values,
          teamProjectId: data?.id,
        });
      }
      onVisibleChange(false);
    });
  };

  return (
    <Modal
      title={title}
      open={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={() => onVisibleChange(false)}
      width={600}
      onOk={onOk}
      className={`${clsPrefix}-group-detail-modal`}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        onValuesChange={onFormValueChange}
        initialValues={formValues}
      >
        <Form.Item
          name="projectName"
          label="项目名称："
          rules={[
            {
              required: true,
              message:
                "名称不能为空且不能为纯数字，且只允许中文、英文、数字、和'_'",
              pattern: /^(?![0-9]+$)[\u4300-\u9fa5_a-zA-Z0-9]+$/,
            },
          ]}
        >
          <Input
            placeholder="请输入项目名称"
            disabled={isEdit}
            maxLength={15}
          />
        </Form.Item>
        {isEdit && (
          <Form.Item
            name="ownerIdList"
            label="项目所有者"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="请选择项目所有人" mode="multiple">
              {userList.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.realName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <When condition={isEdit}>
          <Form.Item name="tags" label="标签设置">
            <Select
              placeholder="请选择项目标签"
              mode="tags"
              tokenSeparators={[","]}
            >
              {teamTags.map((label: any) => (
                <Select.Option key={label.name}>{label.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </When>
        <When condition={!isEdit}>
          <Form.Item name="tags" label="标签设置">
            <Select
              placeholder="请选择项目标签"
              mode="tags"
              tokenSeparators={[","]}
            >
              {allTags.map((label: any) => (
                <Select.Option key={label.name}>{label.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </When>
        <Form.Item name="comment" label="备注">
          <Input.TextArea
            placeholder="请输入备注信息"
            maxLength={50}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
