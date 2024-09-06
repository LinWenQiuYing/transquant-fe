import { PlusOutlined } from "@ant-design/icons";
import { DataType } from "@transquant/utils";
import {
  Col,
  Form,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
import { differenceBy } from "lodash-es";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../../../hooks";
import { Examine } from "../../../types";
import AuditorTable, { AuditorDataType } from "./AuditorTable";

interface ExamineModalProps {
  title?: string;
  data?: DataType<Examine>;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const defaultValue = {
  id: undefined,
  category: 0,
  publisherIds: ["-1"],
};

export default observer(function ExamineModal(props: ExamineModalProps) {
  const { title = "策略入库", visible, onVisibleChange, data } = props;
  const { allUsers, publishers, updateProcessConfig } =
    useStores().organizationStore;

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(defaultValue);
  const [dataSource, setDataSource] = useState<AuditorDataType[]>([]);

  useEffect(() => {
    if (!data) return;
    const needExamine = data.category !== 1;
    const newFormValues = {
      ...formValues,
      publisherIds: needExamine
        ? data.publishersId?.map((id) => `${id}`) || []
        : ["-1"],
      category: data.category,
    };

    setFormValues(newFormValues as any);
    form.setFieldsValue(newFormValues);

    if (needExamine) {
      const _auditor: AuditorDataType[] = [];
      data.auditorsId.forEach((item, index) => {
        const findItem = allUsers.find((i) => item === i.id);
        if (findItem) {
          const data = {
            key: findItem.id,
            orderNumber: index + 1,
            auditorId: findItem.id,
            id: findItem.id,
          };
          _auditor.push(data);
        }
      });
      setDataSource(_auditor);
    }

    if (!visible) {
      setFormValues(defaultValue);
      form.setFieldsValue(defaultValue);
    }
  }, [data, visible]);

  const handleAdd = () => {
    const orderNumber = dataSource.length + 1;
    const newData: AuditorDataType = {
      key: orderNumber,
      orderNumber,
      auditorId: undefined,
    };
    setDataSource([...dataSource, newData]);
  };

  const onDataSourceChange = (data: AuditorDataType[]) => {
    setDataSource(data);
  };

  const onOk = async () => {
    form.validateFields().then(async (values) => {
      const auditorIds = dataSource.map((item) => item.auditorId);

      if (values.category !== 1 && !auditorIds.length) {
        message.info("审核员不能为空");
        return;
      }

      await updateProcessConfig({
        ...values,
        auditorIds,
        id: data?.id,
      });
      onVisibleChange(false);
    });
  };

  const onFormValueChange = (value: any) => {
    if ("category" in value) {
      const values: any = { ...defaultValue, ...value };

      setFormValues(values);
      setDataSource([]);
      form.setFieldsValue(values);
    } else {
      setFormValues({ ...formValues, ...value });
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={onOk}
      width={500}
      destroyOnClose
    >
      <Form
        form={form}
        initialValues={formValues}
        layout="vertical"
        onValuesChange={onFormValueChange}
        preserve={false}
      >
        <Form.Item name="category" label="审批方式">
          <Radio.Group>
            <Radio value={1}>无需审批</Radio>
            <Radio value={0}>逐层审批</Radio>
            <Radio value={2}>全部通过</Radio>
            <Radio value={3}>任一人通过</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label={
            <Row>
              <Col>审核员</Col>
              <Col style={{ marginLeft: 350 }}>
                {formValues.category !== 1 && (
                  <Typography.Link onClick={handleAdd}>
                    <PlusOutlined />
                    添加
                  </Typography.Link>
                )}
              </Col>
            </Row>
          }
          name="auditorId"
        >
          <AuditorTable
            allAuditors={allUsers}
            auditors={differenceBy(allUsers, dataSource, "id")}
            dataSource={dataSource}
            onDataSourceChange={onDataSourceChange}
          />
        </Form.Item>
        <Form.Item
          label="可发布人员"
          name="publisherIds"
          rules={[
            {
              required: formValues.category !== 1,
              message: "可发布人员为必填项",
            },
          ]}
        >
          <Select
            placeholder="请选择发布人员"
            mode="multiple"
            disabled={formValues.category === 1}
          >
            {publishers.map((publisher) => {
              const allDisabled =
                `${publisher.id}` === "-1" &&
                formValues.publisherIds.some((id) => `${id}` !== "-1");
              const memberDisabled =
                `${publisher.id}` !== "-1" &&
                formValues.publisherIds.some((id) => `${id}` === "-1");

              return (
                <Select.Option
                  key={`${publisher.id}`}
                  value={`${publisher.id}`}
                  disabled={allDisabled || memberDisabled}
                >
                  {publisher.realName}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
});
