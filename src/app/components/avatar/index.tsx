import { useStores } from "@transquant/person/hooks";
import MessageModal from "@transquant/person/message/MessageModal";
import { IconFont } from "@transquant/ui";
import { Avatar, Badge } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";

export default observer(function UserAvatar() {
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const { getUnReadedMessages, UnReadedNumber } = useStores().messageStore;

  const clickAvatar = async () => {
    await getUnReadedMessages();
    setMessageModalVisible(true);
  };

  return (
    <div>
      <Badge count={UnReadedNumber}>
        <Avatar
          icon={<IconFont type="logo_TransQuant" />}
          onClick={clickAvatar}
        />
      </Badge>

      {messageModalVisible && (
        <MessageModal
          open={messageModalVisible}
          onVisibleChange={(value: boolean) => setMessageModalVisible(value)}
        />
      )}
    </div>
  );
});
