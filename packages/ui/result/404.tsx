import { antdClsPrefix } from "@transquant/constants";
import { Button, ConfigProvider, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Result404 = () => {
  const navigate = useNavigate();
  return (
    <ConfigProvider prefixCls={antdClsPrefix}>
      <Result
        status="404"
        title="404"
        subTitle="页面不存在"
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            返回
          </Button>
        }
      />
    </ConfigProvider>
  );
};

export default Result404;
