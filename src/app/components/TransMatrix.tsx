import { USER_TOKEN } from "@transquant/constants";
import { useStores as useSpaceStores } from "@transquant/space/hooks";
import { ls } from "@transquant/utils";
import { getToken } from "@transquant/utils/ajax";
import { postMessageToChildWindow } from "@transquant/utils/ajax/helpers";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useOutlet } from "react-router";
import { useStores } from "../hooks";
import Avatar from "./avatar";
import Layout from "./layout";
import Left from "./left";

export default observer(function TransMatrix() {
  const outlet = useOutlet();
  const { collapsed } = useStores().appStore;
  const {
    onWebsocketConnect,
    onWebsocketClose,
    wsInstance,
    shareSpaceIntervalId,
  } = useSpaceStores().shareStore;
  const {
    privateInstance,
    onPrivateWebSocketConnect,
    onPrivateWebSocketClose,
    envIntervalId,
    intervalId,
  } = useSpaceStores().imageStore;

  useEffect(() => {
    const url = "/tqlab/ws/user";
    const privateUrl = "/tqlab/ws/private";
    const token = ls.getItem(USER_TOKEN);
    const newToken = getToken(token, url);
    const privateToken = getToken(token, privateUrl);

    if (!wsInstance) {
      onWebsocketConnect(newToken);
    }

    if (!privateInstance) {
      onPrivateWebSocketConnect(privateToken);
    }

    return () => {
      onWebsocketClose(false);
      onPrivateWebSocketClose();
      if (envIntervalId) {
        clearInterval(envIntervalId);
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (shareSpaceIntervalId) {
        clearInterval(shareSpaceIntervalId);
      }
    };
  }, []);

  window.onbeforeunload = function () {
    /** 主窗口关闭刷新子窗口关闭不销毁 */
    postMessageToChildWindow();
  };

  return (
    <Layout avatar={<Avatar />}>
      <div className="relative flex w-full h-full overflow-hidden">
        <Left />
        <div
          id="trans_matrix_content"
          className={`${
            collapsed
              ? "w-full left-[0px]"
              : "w-[calc(100%-280px)] left-[280px]"
          }  h-full  flex-1 transition-all duration-300 absolute bg-lightpink`}
        >
          {outlet}
        </div>
      </div>
    </Layout>
  );
});
