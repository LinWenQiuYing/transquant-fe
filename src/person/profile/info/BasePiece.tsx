import { PUBLICURL } from "@transquant/constants";
import { Card, Col, Row } from "antd";
import { observer } from "mobx-react";
import UserAvatar from "./UserAvatar";
import UserInfo from "./UserInfo";

export default observer(function BasePiece() {
  return (
    <Card title="个人信息" className="mb-5">
      <Row className="flex" justify="space-between" align="middle">
        <Col span={3}>
          <UserAvatar />
        </Col>
        <Col span={15}>
          <UserInfo />
        </Col>
        <Col span={6}>
          <img src={`${PUBLICURL}/images/user-info.svg`} alt="user-info" />
        </Col>
      </Row>
    </Card>
  );
});
