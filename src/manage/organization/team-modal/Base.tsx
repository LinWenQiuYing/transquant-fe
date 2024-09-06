import {
  nameReg,
  nameRegMessage,
  nameRegMessageWithoutUppercase,
  nameWithoutChineseReg,
  nameWithoutChineseRegAndUppercase,
  nameWithoutChineseRegMessage,
} from "@transquant/constants";
import { CustomTitle } from "@transquant/ui";
import { Form, Input, Select } from "antd";
import useBase from "./use-base";

export default function Base(props: ReturnType<typeof useBase>) {
  const {
    form,
    title,
    type,
    subTitle,
    formValues,
    filterOptions,
    backfillOptions,
    onFormValueChange,
  } = props;

  return (
    <Form
      form={form}
      layout="vertical"
      preserve={false}
      initialValues={formValues}
      autoComplete="off"
      onValuesChange={onFormValueChange}
    >
      <CustomTitle title={title} />
      <div className="columns-2">
        <Form.Item name="startTeamId" label="当前团队">
          <Select placeholder="请选择团队" disabled options={backfillOptions} />
        </Form.Item>
        {type === "merge" ? (
          <Form.Item
            name="otherTeamId"
            label="待选团队"
            rules={[{ required: true }]}
          >
            <Select placeholder="请选择团队" options={filterOptions} />
          </Form.Item>
        ) : (
          <Form.Item />
        )}
      </div>
      <CustomTitle title={subTitle} />
      <div className="columns-2">
        <Form.Item
          name="name"
          label="团队名称"
          rules={[
            {
              required: true,
              message: nameRegMessage,
              pattern: nameReg,
            },
          ]}
        >
          <Input placeholder="请输入团队名称" maxLength={20} />
        </Form.Item>
        <Form.Item
          name="spaceName"
          label="团队空间名称"
          rules={[
            {
              required: true,
              message: nameWithoutChineseRegMessage,
              pattern: nameWithoutChineseReg,
            },
          ]}
        >
          <Input placeholder="请输入团队空间名称" maxLength={100} />
        </Form.Item>
      </div>
      <div className="columns-2">
        <Form.Item
          name="dbName"
          label="团队数据库名称"
          rules={[
            {
              required: true,
              pattern: nameWithoutChineseRegAndUppercase,
              message: nameRegMessageWithoutUppercase,
            },
          ]}
        >
          <Input placeholder="请输入团队数据库名称" maxLength={100} />
        </Form.Item>
        <Form.Item name="contacter" label="团队联系人">
          <Input placeholder="请输入团队联系人" maxLength={100} />
        </Form.Item>
      </div>
      <div className="columns-2">
        <Form.Item name="contracterInfo" label="联系方式">
          <Input placeholder="请输入联系方式" maxLength={100} />
        </Form.Item>
        <Form.Item className="visible-0" />
      </div>
      <Form.Item name="description" label="团队介绍">
        <Input.TextArea placeholder="请输入团队介绍" maxLength={100} />
      </Form.Item>
    </Form>
  );
}
