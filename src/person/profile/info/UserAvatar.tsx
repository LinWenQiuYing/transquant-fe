import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import { Avatar, Input, message, Space, Typography } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import { useStores } from "../../hooks";

export default observer(function UserAvatar() {
  const { updateMyUserInfo, userInfo } = useStores().profileStore;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    setName(`${userInfo?.userInfo.user.realName}`);
  }, [userInfo]);

  const onNameChange = () => {
    if (!name.length) {
      message.info("姓名不能为空");
      return;
    }
    updateMyUserInfo({ name });

    setEditing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-32">
      <div className={`${clsPrefix}-person-info-avatar relative`}>
        <Avatar size={80} icon={<IconFont type="logo_TransQuant" />} />
      </div>
      <div className="flex items-center mt-2.5 [&>anticon]:cursor-pointer">
        <If condition={editing}>
          <Then>
            <Input
              placeholder="请输入名字"
              bordered={false}
              value={name}
              maxLength={15}
              className="w-[100px] ml-8"
              onChange={(e) =>
                setName(e.target.value.replace(/(^\s*)|(\s*$)/g, ""))
              }
              autoFocus
            />
            <Space>
              <Typography.Link>
                <CheckOutlined onClick={onNameChange} />
              </Typography.Link>
              <Typography.Link>
                <CloseOutlined
                  onClick={() => {
                    setName(`${userInfo?.userInfo.user.realName}`);
                    setEditing(false);
                  }}
                />
              </Typography.Link>
            </Space>
          </Then>
          <Else>
            <span className="px-1 py-3 text-base font-semibold">
              {userInfo?.userInfo.user.realName}
            </span>
            <Space>
              <Typography.Link>
                <EditOutlined onClick={() => setEditing(true)} />
              </Typography.Link>
            </Space>
          </Else>
        </If>
      </div>
    </div>
  );
});
