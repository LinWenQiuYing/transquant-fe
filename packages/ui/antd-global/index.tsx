import { message, Modal } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import { antdClsPrefix } from "../../constants";

moment.locale("zh-cn");

export default function initGlobalAntd() {
  message.config({
    prefixCls: `${antdClsPrefix}-message`,
  });
  Modal.defaultProps = {
    ...Modal.defaultProps,
    maskClosable: false,
    centered: true,
  };
}
