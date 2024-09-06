import { clsPrefix } from "@transquant/constants";
import { useMount } from "ahooks";
import { observer } from "mobx-react";
import { useState } from "react";
import { When } from "react-if";
import { useStores } from "../../hooks";
import { BarDataType } from "../../types";
import BarChart from "./BarChart";
import "./index.less";
import PieChart from "./PieChart";

export default observer(function ProjectView() {
  const [lineData, setLineData] = useState<BarDataType>();
  const { getDefineUserCount, projectInfo } = useStores().projectManageStore;
  const pieStyle = {
    height: lineData?.count ? "calc(100% - 343px)" : "100%",
    minHeight: "660px",
  };

  useMount(async () => {
    if (projectInfo && projectInfo.code) {
      const data3 = await getDefineUserCount();
      const _data3 = {
        count: data3.count,
        userList: data3.userList.map((item: any) => {
          return {
            number: item.count,
            status: item.userName,
          };
        }),
      };
      setLineData(_data3);
    }
  });

  return (
    <div className={`${clsPrefix}-project-view`}>
      <PieChart title="任务实例状态统计" style={pieStyle} />
      <PieChart title="工作流实例状态统计" style={pieStyle} />
      <When condition={lineData?.count}>
        <BarChart title="工作流定义" data={lineData} />
      </When>
    </div>
  );
});
