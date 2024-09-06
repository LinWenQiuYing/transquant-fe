import { Col, Form, Input, Modal, Row, Select } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../../hooks";

interface ApprovedModalProps {
  title?: string;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export type PersonalAuth = {
  auth: 0 | 1;
  userId: number;
};

export type IApprovedValue = {
  publisher: string;
  targetTeam: string;
  authType: number;
  comment: string;
  personalAuth: PersonalAuth[];
  processInstanceId: string;
  tags: string[];
  targetProjectName: string;
};

// const options = [
//   { label: "整个团队", value: 0 },
//   {
//     label: "特定人员",
//     value: 1,
//   },
// ];

const defaultFormValues: Partial<IApprovedValue> = {
  authType: 0,
  comment: "",
  personalAuth: [],
  tags: [],
  targetProjectName: "",
};

export default observer(function ApprovedModal(props: ApprovedModalProps) {
  const { title = "新建因子项目", visible, onVisibleChange } = props;
  const { approvalInfo, allTeamTags, passApproval } = useStores().publishStore;

  const [form] = Form.useForm();
  const [formValues, setFormValues] =
    useState<Partial<IApprovedValue>>(defaultFormValues);

  useEffect(() => {
    const newFormValues = {
      ...defaultFormValues,
      publisher: approvalInfo?.publisher,
      targetTeam: approvalInfo?.targetTeam,
      tags: toJS(approvalInfo?.tags || []),
      authType: approvalInfo?.authType,
      personalAuth: toJS(approvalInfo?.personalAuth),
      targetProjectName: approvalInfo?.projectName,
    };

    setFormValues(newFormValues);
    form.setFieldsValue(newFormValues);
  }, [approvalInfo]);

  const onFormValueChange = (value: any) => {
    if ("authType" in value) {
      value = { authType: +value.authType };
    }

    setFormValues({ ...formValues, ...value });
  };

  // const onPermissionChange: RadioGroupProps["onChange"] = (e) => {
  //   const [userId, auth] = e.target.value.split("_");

  //   const personalAuths = cloneDeep(formValues.personalAuth) || [];

  //   const filterItems = personalAuths.filter(
  //     (auth) => `${auth.userId}` !== `${userId}`
  //   );

  //   onFormValueChange({ personalAuth: [...filterItems, { userId, auth }] });
  // };

  // const columns: ColumnsType<DataType<UserItem>> = [
  //   {
  //     title: "成员",
  //     dataIndex: "realName",
  //     key: "realName",
  //     width: "50%",
  //   },
  //   {
  //     title: "权限",
  //     className: "auth",
  //     dataIndex: "auth",
  //     width: "50%",
  //     render(_: any, raw: DataType<UserItem>) {
  //       const value = (formValues.personalAuth || [])
  //         .filter((item) => `${item.userId}` === `${raw.id}`)
  //         .map((item) => `${item.userId}_${item.auth}`)[0];

  //       return (
  //         <Radio.Group onChange={onPermissionChange} value={value}>
  //           <Radio value={`${raw.id}_0`}>可查看</Radio>
  //           <Radio value={`${raw.id}_1`}>可查看&可下载</Radio>
  //         </Radio.Group>
  //       );
  //     },
  //   },
  // ];

  const onOk = async () => {
    let values = await form.validateFields();
    values = {
      ...values,
      ...{
        personalAuth: formValues.personalAuth,
        processInstanceId: approvalInfo?.id,
      },
    };
    await passApproval(values);
    onVisibleChange(false);
  };

  // const users = useDataSource<UserItem>(userList);

  return (
    <Modal
      title={title}
      open={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={() => onVisibleChange(false)}
      width={800}
      onOk={onOk}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={formValues}
        onValuesChange={onFormValueChange}
      >
        <Row justify="space-between">
          <Col span={11}>
            <Form.Item name="publisher" label="发布人">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="targetTeam" label="发布团队">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="space-between">
          <Col span={11}>
            <Form.Item
              name="targetProjectName"
              label="项目名称"
              rules={[
                {
                  required: true,
                  message:
                    "名称不能为空且不能为纯数字，且只允许中文、英文、数字、和'_'",
                  pattern: /^(?![0-9]+$)[\u4300-\u9fa5_a-zA-Z0-9]+$/,
                },
              ]}
            >
              <Input placeholder="请输入项目名称" maxLength={15} />
            </Form.Item>
          </Col>

          <Col span={11}>
            <Form.Item name="tags" label="标签设置">
              <Select
                placeholder="请选择项目标签"
                mode="tags"
                tokenSeparators={[","]}
              >
                {allTeamTags.map((label) => (
                  <Select.Option key={label.name}>{label.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

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
