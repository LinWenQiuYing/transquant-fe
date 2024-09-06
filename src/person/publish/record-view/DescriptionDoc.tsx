import { Markdown } from "@transquant/common";
import useMount from "ahooks/lib/useMount";
import { Select } from "antd";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { useStores } from "../../hooks";

export default observer(function DescriptionDoc() {
  const { markdownFileList, markdownValue, getMDFile, getMDFileList } =
    useStores().publishStore;
  const params = useParams();

  useMount(() => {
    getMDFileList(params.id);
  });

  return (
    <div>
      <Select
        placeholder="请选择文件"
        style={{ width: 200 }}
        onChange={(id) => getMDFile(id)}
      >
        {markdownFileList.map((item) => (
          <Select.Option key={item.id}>{item.name}</Select.Option>
        ))}
      </Select>
      <Markdown data={markdownValue} />
    </div>
  );
});
