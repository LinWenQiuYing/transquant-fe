import { paths } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { Audit } from "../../types";

interface OperatorMenuProps {
  data: DataType<Audit>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;

  const navigate = useNavigate();

  const onView = () => {
    navigate(`${paths.publish}/approve/${data.id}`);
  };

  return (
    <Space>
      <Tooltip title="查看详情">
        <Typography.Link onClick={onView}>
          <IconFont type="chakanxiangqing" />
        </Typography.Link>
      </Tooltip>
    </Space>
  );
});
