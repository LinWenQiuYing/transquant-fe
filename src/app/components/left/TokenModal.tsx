import { USER_TOKEN } from "@transquant/constants";
import { copy, ls } from "@transquant/utils";
import { getToken } from "@transquant/utils/ajax";
import { Col, Divider, Input, Modal, Row } from "antd";
import { useState } from "react";

interface TokenModalProps {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default function TokenModal(props: TokenModalProps) {
  const { visible, onVisibleChange } = props;
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const _getToken = () => {
    const ssToken = ls.getItem(USER_TOKEN);
    const _token = getToken(ssToken, url);
    setToken(_token);
  };

  return (
    <Modal
      open={visible}
      title="获取token"
      onCancel={() => onVisibleChange(false)}
      footer={null}
    >
      <Row>
        <Col span={24}>
          <Input.Search
            placeholder="请输入url"
            onChange={(e) => setUrl(e.target.value)}
            onSearch={_getToken}
            enterButton="getToken"
          />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <Input.Search
            placeholder="token"
            value={token}
            onSearch={() => copy(token)}
            enterButton="一键复制"
          />
        </Col>
      </Row>
    </Modal>
  );
}
