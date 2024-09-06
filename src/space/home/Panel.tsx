import { PersonalModule } from "@transquant/app";
import { useStores as useAppStores } from "@transquant/app/hooks";
import { clsPrefix, paths, USER_INFO } from "@transquant/constants";
import { useStores as usePersonStores } from "@transquant/person/hooks";
import { RecordTab } from "@transquant/person/publish/TabView";
import { IconFont } from "@transquant/ui";
import { ls } from "@transquant/utils";
import { useMount } from "ahooks";
import {
  Avatar,
  Badge,
  Calendar,
  CalendarProps,
  Card,
  List,
  Space,
  Typography,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { observer } from "mobx-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStores } from "../hooks";

const CalendarView = observer(() => {
  const { getTradeDate, tradeDates } = useStores().homeStore;
  const userInfo = ls.getItem(USER_INFO)?.userInfo || {};
  const [time, setTime] = useState<string>(
    dayjs().format("YYYY-MM-DD hh:mm:ss")
  );

  useEffect(() => {
    getTradeDate();
    const timerId = setInterval(() => {
      setTime(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current) => {
    const date = current.format("YYYY-MM-DD");
    const isTradeDay = tradeDates.includes(date);

    return isTradeDay ? (
      <Badge
        status="error"
        style={{
          position: "absolute",
          top: "16px",
          left: "10px",
        }}
      />
    ) : null;
  };

  const headerRender = () => {
    return (
      <Space style={{ marginBottom: 10 }}>
        <Avatar
          size={42}
          src={
            <IconFont
              type="logo_TransQuant"
              className="pt-1 [&>svg]:w-8 [&>svg]:h-8"
            />
          }
          style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
        />
        <Space direction="vertical" style={{ marginLeft: 10 }} size={6}>
          <p className="font-semibold">{userInfo.user?.realName}，欢迎登录</p>
          <Typography.Text disabled>{time}</Typography.Text>
        </Space>
      </Space>
    );
  };

  return (
    <Card className="[&>.trans-quant-antd-card-body]:pb-2.5">
      <Calendar
        fullscreen={false}
        headerRender={headerRender}
        cellRender={cellRender}
        className={`${clsPrefix}-home-calendar`}
        disabledDate={(current) => {
          return (
            current < moment().startOf("month") ||
            current > moment().endOf("month")
          );
        }}
      />
    </Card>
  );
});

const TodoList = observer(() => {
  const { getToDoList, todoList } = useStores().homeStore;
  const { onActiveMenuChange, onLeftMenuSelect } = useAppStores().appStore;
  const { onActiveTabChange } = usePersonStores().publishStore;
  const navigate = useNavigate();

  useMount(() => {
    getToDoList();
  });

  const onTodoViewClick = async () => {
    await onActiveMenuChange("personal");
    navigate(paths.publish);
    onLeftMenuSelect(PersonalModule.PublishManage);
    onActiveTabChange(RecordTab.Approve);
  };

  return (
    <Card
      title="待办事项"
      extra={
        <Typography.Link onClick={onTodoViewClick}>{`查看 >>`}</Typography.Link>
      }
    >
      <List
        dataSource={todoList}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.title} description={item.content} />
          </List.Item>
        )}
      />
    </Card>
  );
});

export default function Panel() {
  return (
    <div className="flex flex-col gap-5 ml-5 w-80">
      <CalendarView />
      <TodoList />
    </div>
  );
}
