import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { useMount } from "ahooks";
import { Button, Col, Input, message, Row, Space, Typography } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { Else, If, Then, When } from "react-if";
import { useStores } from "../../hooks";
import PswModify from "./PswModify";

export default observer(function UserInfo() {
  const { updateMyUserInfo, userInfo, getUserInfo } = useStores().profileStore;
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [modifyVisible, setModifyVisible] = useState(false);

  useMount(() => {
    getUserInfo();
  });

  useEffect(() => {
    setPhone(`${userInfo?.userInfo.user.telephone}`);
  }, [userInfo]);

  const onTelChange = () => {
    if (phone.length < 11) {
      message.info("手机号码少于11位");
      return;
    }
    updateMyUserInfo({ telephone: phone });
    setEditing(false);
  };

  return (
    <div className="py-5 w-80">
      <Row className="leading-8">
        <Col span={7} className="text-right">
          用户名：
        </Col>
        <Col span={17}>{userInfo?.userInfo.user.username}</Col>
      </Row>
      <Row className="leading-8">
        <Col span={7} className="text-right">
          邮箱：
        </Col>
        <Col span={17}>{userInfo?.userInfo.user.email}</Col>
      </Row>
      <Row className="leading-8">
        <Col span={7} className="text-right">
          电话：
        </Col>
        <Col span={17}>
          <If condition={editing}>
            <Then>
              <div className="flex items-center">
                <Input
                  placeholder="请输入电话"
                  bordered={false}
                  value={phone}
                  type="tel"
                  minLength={11}
                  style={{ width: 120 }}
                  maxLength={11}
                  onChange={(e) => {
                    const phone = e.target.value.replace(/[^\d]/g, "");
                    setPhone(phone);
                  }}
                  autoFocus
                />
                <Space>
                  <Typography.Link>
                    <CheckOutlined onClick={onTelChange} />
                  </Typography.Link>
                  <Typography.Link>
                    <CloseOutlined
                      onClick={() => {
                        setPhone(`${userInfo?.userInfo.user.telephone}`);
                        setEditing(false);
                      }}
                    />
                  </Typography.Link>
                </Space>
              </div>
            </Then>
            <Else>
              <div>
                <span className="mr-2.5">
                  {userInfo?.userInfo.user.telephone || "暂无电话"}
                </span>
                <Typography.Link>
                  <EditOutlined onClick={() => setEditing(true)} />
                </Typography.Link>
              </div>
            </Else>
          </If>
        </Col>
      </Row>
      <Row className="leading-8">
        <Col span={7} className="text-right">
          密码：
        </Col>
        <Col span={17}>
          <Button
            type="primary"
            size="small"
            onClick={() => setModifyVisible(true)}
          >
            修改密码
          </Button>
        </Col>
      </Row>
      <When condition={modifyVisible}>
        <PswModify
          visible={modifyVisible}
          onVisibleChange={(value) => setModifyVisible(value)}
        />
      </When>
    </div>
  );
});
