import { Anchor, Empty, Spin } from "antd";
import { observer } from "mobx-react";
import ChartView from "../../../../chart-view";
import { useStores } from "../../../../hooks";
import "./index.less";

const { Link } = Anchor;

export default observer(function ProfitView() {
  const { jsonData, loading } = useStores().strategyResearchStore;

  if (!jsonData) return <Empty style={{ marginTop: 200 }} />;

  const onAnchorClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const keys = jsonData.map((item: { title: string }) => item.title);

  return (
    <div className="chart-wrapper">
      <div className="chart-wrapper-content" id="container">
        <Spin spinning={!!loading}>
          {jsonData.map((item: any, index: number) => (
            <div id={`${item.title}-${index}`} key={index}>
              <ChartView data={item} />
            </div>
          ))}
        </Spin>
      </div>
      <Anchor
        onClick={onAnchorClick}
        getContainer={() => document.getElementById("container")!}
        className="chart-wrapper-right"
        affix={false}
      >
        {keys.map((item: string, index: number) => (
          <Link href={`#${item}-${index}`} key={item} title={item} />
        ))}
      </Anchor>
    </div>
  );
});
