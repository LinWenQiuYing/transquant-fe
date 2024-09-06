import { clsPrefix, PUBLICURL } from "@transquant/constants";
import { Empty } from "antd";

export default function NoPermissionPage() {
  return (
    <Empty
      image={`${PUBLICURL}/images/no-permission.png`}
      imageStyle={{
        height: 200,
      }}
      className={`${clsPrefix}-no-permission-page`}
      description={<span>您没有该页面的访问权限！</span>}
    />
  );
}
