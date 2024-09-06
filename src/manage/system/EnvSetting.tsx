import { EditOutlined, QuestionCircleFilled } from "@ant-design/icons";
import { Permission } from "@transquant/ui";
import { useMount } from "ahooks";
import {
  Button,
  Card,
  Descriptions,
  message,
  Radio,
  Select,
  Space,
  TimePicker,
  Tooltip,
} from "antd";
import { SelectProps } from "antd/lib";
import dayjs, { Dayjs } from "dayjs";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../hooks";

export enum JobType {
  EVERY_DAY = 1,
  EVERY_MONTH = 2,
  EVERY_WEEK = 3,
}

export type ISolidState = {
  on: boolean;
  jobType: JobType;
  time: Dayjs | null;
  weekDay: (typeof weekOptions)[number]["value"];
};

export type ICompressState = {
  on: boolean;
  jobType: JobType;
  day: number;
  weekDay: (typeof weekOptions)[number]["value"];
  time: Dayjs | null;
};

const weekOptions = [
  {
    label: "周一",
    value: 2,
  },
  {
    label: "周二",
    value: 3,
  },
  {
    label: "周三",
    value: 4,
  },
  {
    label: "周四",
    value: 5,
  },
  {
    label: "周五",
    value: 6,
  },
  {
    label: "周六",
    value: 7,
  },
  {
    label: "周日",
    value: 1,
  },
] as const;

const defaultSolidState: ISolidState = {
  on: true,
  jobType: JobType.EVERY_DAY,
  time: null,
  weekDay: 1,
};

const defaultCompressState: ICompressState = {
  on: true,
  jobType: JobType.EVERY_MONTH,
  day: 1,
  weekDay: 1,
  time: null,
};

export default observer(function EnvSetting() {
  const [editing, setEditing] = useState(false);
  const [solidState, setSolidState] = useState<ISolidState>(defaultSolidState);
  const [compressState, setCompressState] =
    useState<ICompressState>(defaultCompressState);
  const {
    configAutoSolidify,
    configAutoSquash,
    // getAutoSolidifyConfig,
    getAutoSquashConfig,
    solidProxyState,
    compressProxyState,
  } = useStores().systemStore;

  useMount(() => {
    // getAutoSolidifyConfig();
    getAutoSquashConfig();
  });

  useEffect(() => {
    if (solidProxyState) {
      setSolidState(solidProxyState);
    }
    if (compressProxyState) {
      setCompressState(compressProxyState);
    }
  }, [solidProxyState, compressProxyState]);

  const onSave = () => {
    Promise.all([
      configAutoSolidify(solidState),
      configAutoSquash(compressState),
    ]).then(() => {
      // getAutoSolidifyConfig();
      getAutoSquashConfig();
      message.success("编辑成功");
    });
    setEditing(false);
  };

  const extraEl = editing ? (
    <Space>
      <Button onClick={() => setEditing(false)}>取消</Button>
      <Button type="primary" onClick={onSave}>
        保存
      </Button>
    </Space>
  ) : (
    <Space>
      <Permission code="B190113" hidden>
        <Button
          icon={<EditOutlined />}
          type="primary"
          onClick={() => setEditing(true)}
        >
          编辑
        </Button>
      </Permission>
    </Space>
  );

  // const renderSolid = () => {
  //   return (
  //     <div>
  //       <Descriptions column={1} labelStyle={{ alignItems: "center" }}>
  //         <Descriptions.Item label="团队环境自动固化">
  //           <Radio.Group
  //             value={solidState.on}
  //             disabled={!editing}
  //             onChange={(e) =>
  //               setSolidState({ ...solidState, on: e.target.value })
  //             }
  //           >
  //             <Radio value>开启</Radio>
  //             <Radio value={false}>关闭</Radio>
  //           </Radio.Group>
  //         </Descriptions.Item>
  //         {solidState.on && (
  //           <Descriptions.Item label="执行频率">
  //             <Space>
  //               <Select
  //                 disabled={!editing}
  //                 value={solidState.jobType}
  //                 className="w-40"
  //                 options={[
  //                   {
  //                     value: JobType.EVERY_DAY,
  //                     label: "每日",
  //                   },
  //                   {
  //                     value: JobType.EVERY_WEEK,
  //                     label: "每周",
  //                   },
  //                 ]}
  //                 onChange={(value) =>
  //                   setSolidState({ ...solidState, jobType: value })
  //                 }
  //               />
  //               <Select
  //                 disabled={!editing}
  //                 value={solidState.weekDay}
  //                 className={`w-40 ${
  //                   solidState.jobType === JobType.EVERY_DAY
  //                     ? "hidden"
  //                     : "block"
  //                 }`}
  //                 options={weekOptions as unknown as SelectProps["options"]}
  //                 onChange={(value) =>
  //                   setSolidState({ ...solidState, weekDay: value })
  //                 }
  //               />
  //               <TimePicker
  //                 disabled={!editing}
  //                 value={dayjs(solidState.time, "HH:mm:ss")}
  //                 format="HH:mm:ss"
  //                 onChange={(time: Dayjs | null) => {
  //                   setSolidState({
  //                     ...solidState,
  //                     time: dayjs(time).format("HH:mm:ss") as unknown as Dayjs,
  //                   });
  //                 }}
  //               />
  //             </Space>
  //           </Descriptions.Item>
  //         )}
  //       </Descriptions>
  //     </div>
  //   );
  // };

  const renderCompress = () => {
    return (
      <div>
        <Descriptions column={1} labelStyle={{ alignItems: "center" }}>
          <Descriptions.Item
            label={
              <div>
                镜像自动压缩
                <Tooltip title="适用于个人及团队环境，团队环境镜像压缩后将自动重启">
                  <QuestionCircleFilled className="pl-2 text-gray-400 cursor-pointer" />
                </Tooltip>
              </div>
            }
          >
            <Radio.Group
              value={compressState.on}
              disabled={!editing}
              onChange={(e) =>
                setCompressState({ ...compressState, on: e.target.value })
              }
            >
              <Radio value>开启</Radio>
              <Radio value={false}>关闭</Radio>
            </Radio.Group>
          </Descriptions.Item>
          {compressState.on && (
            <Descriptions.Item label="执行频率">
              <Space>
                <Select
                  disabled={!editing}
                  value={compressState.jobType}
                  className="w-40"
                  options={[
                    {
                      value: JobType.EVERY_WEEK,
                      label: "每周",
                    },
                    {
                      value: JobType.EVERY_MONTH,
                      label: "每月",
                    },
                  ]}
                  onChange={(value) =>
                    setCompressState({ ...compressState, jobType: value })
                  }
                />
                <Select
                  disabled={!editing}
                  value={compressState.weekDay}
                  className={`w-40 ${
                    compressState.jobType === JobType.EVERY_WEEK
                      ? "block"
                      : "hidden"
                  }`}
                  options={weekOptions as unknown as SelectProps["options"]}
                  onChange={(value) =>
                    setCompressState({ ...compressState, weekDay: value })
                  }
                />
                <Select
                  disabled={!editing}
                  value={compressState.day}
                  className={`w-40 ${
                    compressState.jobType === JobType.EVERY_MONTH
                      ? "block"
                      : "hidden"
                  }`}
                  options={Array.from({ length: 28 }, (_, i) => ({
                    label: `${i + 1}号`,
                    value: i + 1,
                  }))}
                  onChange={(value) =>
                    setCompressState({ ...compressState, day: value })
                  }
                />
                <TimePicker
                  disabled={!editing}
                  value={dayjs(compressState.time, "HH:mm:ss")}
                  format="HH:mm:ss"
                  onChange={(time: Dayjs | null) =>
                    setCompressState({
                      ...compressState,
                      time: dayjs(time).format("HH:mm:ss") as unknown as Dayjs,
                    })
                  }
                />
              </Space>
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
    );
  };

  return (
    <Card title="环境设置" extra={extraEl}>
      {/* {renderSolid()} */}
      {/* <Divider className="mt-0" /> */}
      {renderCompress()}
      <div className="relative bg-gray-200 py-2 px-4 before:absolute before:h-full before:top-0 before:bottom-0 before:left-0 before:w-[2px] before:content-[''] before:bg-red-600">
        建议镜像压缩的执行时间与环境固化的执行时间间隔4小时以上
      </div>
    </Card>
  );
});
