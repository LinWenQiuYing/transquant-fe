// import the react-json-view component
import ReactJson from "react-json-view";

// use the component in your app!

interface JsonViewProps {
  data: object;
}

export default function JsonView(props: JsonViewProps) {
  const { data } = props;
  return (
    <div style={{ height: 826, overflow: "auto" }}>
      <ReactJson
        src={data}
        theme="ashes"
        indentWidth={2}
        collapseStringsAfterLength={30}
      />
    </div>
  );
}
