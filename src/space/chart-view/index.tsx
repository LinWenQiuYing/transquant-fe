import { When } from "react-if";
import Bar from "./bar";
import Boxplot from "./Boxplot";
import HeatMap from "./HeatMap";
import "./index.less";
import Line from "./Line";
import TableView from "./table";
import TreeMap from "./tree-map";

interface ChartViewProps {
  data: any;
}

export default function ChartView(props: ChartViewProps) {
  const { data } = props;

  return (
    <div className="chart-view-content">
      <When condition={data.type === "bar"}>
        <Bar data={data} />
      </When>
      <When condition={data.type === "line"}>
        <Line data={data} />
      </When>
      <When condition={data.type === "heatmap"}>
        <HeatMap data={data} />
      </When>
      <When condition={data.type === "boxplot"}>
        <Boxplot data={data} />
      </When>
      <When condition={data.type === "treemap"}>
        <TreeMap data={data} />
      </When>
      <When condition={data.type === "table"}>
        <TableView data={data} />
      </When>
    </div>
  );
}
