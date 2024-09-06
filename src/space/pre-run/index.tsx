import { Markdown } from "@transquant/common";
import { ajax } from "@transquant/utils";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Divider,
  Empty,
  message,
  Modal,
  Spin,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { When } from "react-if";
import { useStores } from "../hooks";

interface PreRunProps {
  type?: "team" | "person";
  jobId: number;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

type RangeValue = [Dayjs | null, Dayjs | null] | null;

const preRunJob = (data: {
  type: "team" | "person";
  endDate: string;
  jobId: number;
  startDate: string;
}) => {
  const url =
    data.type === "team"
      ? "/tqlab/quartzteamjob/preRunTeamJob"
      : `/tqlab/quartzjob/preRunJob`;
  ajax<string>({
    url,
    method: "post",
    data,
  });
};

const shutdownPreRunJob = (quartzJobId: number) => {
  ajax({
    url: `/tqlab/quartzjob/shutdownPreRunJob`,
    params: { quartzJobId },
  });
};

export default observer(function PreRun(props: PreRunProps) {
  const { visible, onVisibleChange, jobId, type = "person" } = props;
  const [time, setTime] = useState<RangeValue>(null);
  const { jobLog, resetJobLog, logEnd } = useStores().shareStore;
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setRunning(!logEnd);
  }, [logEnd]);

  const onStart = () => {
    if (!time) return;
    const diffDays = time[0]?.diff(time[1], "days") || 0;
    if (Math.abs(diffDays) > 30) {
      message.info("时间间隔不能超过30天");
      return;
    }
    setRunning(true);
    preRunJob({
      type,
      jobId,
      startDate: dayjs(time[0]).format("YYYY-MM-DD"),
      endDate: dayjs(time[1]).format("YYYY-MM-DD"),
    });
  };

  const onCancel = () => {
    resetJobLog();
    setRunning(false);
    shutdownPreRunJob(jobId);
    onVisibleChange(false);
  };

  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    const yesterday = Date.now() - 24 * 60 * 60 * 1000;

    return current > dayjs(yesterday).endOf("day");
  };

  return (
    <Modal
      title="试运行"
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={null}
    >
      <div>
        区间设置：
        <DatePicker.RangePicker
          value={time}
          onChange={setTime}
          className="mx-2"
          disabledDate={disabledDate}
        />
        <Button type="primary" disabled={!time || running} onClick={onStart}>
          试运行
        </Button>
      </div>
      <Divider dashed />
      <div>
        <div className="relative">
          <p className="bg-red-600 w-[3px] h-4 absolute top-1 left-0 mr-2" />
          <strong className="relative ml-2">日志信息</strong>
        </div>
        <div className="p-3 mt-5 overflow-scroll border border-gray-300 border-solid rounded-lg h-96">
          {running && (
            <Spin
              className="pl-[50%] mt-[150px]"
              size="large"
              spinning={running}
            />
          )}
          <When condition={!running}>
            {jobId !== jobLog?.jobId ? (
              <Empty description="请设置试运行区间" className="mt-20" />
            ) : (
              <Markdown data={jobLog.log} />
            )}
          </When>
        </div>
      </div>
    </Modal>
  );
});
