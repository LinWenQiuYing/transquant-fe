import { IconFont } from "@transquant/ui";
import { Space } from "antd";
import { observer } from "mobx-react";
import { useStores } from "../../hooks";

export type AppType = "TransMatrix" | "TransChaos" | "Wuya";

const TransMatrixLogo = () => (
  <IconFont
    type="logo_TransQuant"
    className="rounded-lg text-[40px] bg-gradient-to-r from-red-500 to-red-600 shadow-md shadow-red-400 text-white"
  />
);

export default observer(function Logo() {
  const { onCollapsedChanged, collapsed } = useStores().appStore;

  return (
    <>
      <div className="relative flex items-center justify-between mb-5 cursor-pointer">
        <Space>
          <TransMatrixLogo />
          <b>Transquant</b>
        </Space>
        <div
          className={`${
            collapsed && "right-[-60px]"
          } absolute right-0 top-0 flex items-center justify-center w-8 h-8 bg-white shadow-md rounded-md text-gray-500 transition-all duration-300 cursor-pointer`}
          onClick={() => onCollapsedChanged(!collapsed)}
        >
          <IconFont type="shouqi" />
        </div>
      </div>
    </>
  );
});
