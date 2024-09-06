import { paths } from "@transquant/constants";
import { IconFont, Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { ApprovalItem } from "../types";

interface OperatorMenuProps {
  data: DataType<ApprovalItem>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;

  const navigate = useNavigate();

  const onView = () => {
    navigate(`${paths.approval}/${data.id}`);
  };

  return (
    <Space>
      <Permission code="B160105" disabled>
        <Tooltip title="查看详情">
          <Typography.Link onClick={onView}>
            <IconFont type="chakanxiangqing" />
          </Typography.Link>
        </Tooltip>
      </Permission>
    </Space>
  );
});
