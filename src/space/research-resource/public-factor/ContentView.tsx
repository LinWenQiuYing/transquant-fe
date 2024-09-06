import { CopyOutlined, DownloadOutlined } from "@ant-design/icons";
import { python } from "@codemirror/lang-python";
import { Markdown } from "@transquant/common";
import { clsPrefix } from "@transquant/constants";
import { IconFont, Permission } from "@transquant/ui";
import { copy } from "@transquant/utils";
import { materialLight } from "@uiw/codemirror-theme-material";
import CodeMirror from "@uiw/react-codemirror";
import { useUnmount } from "ahooks";
import { Button, Card, Empty, message, Space, Tooltip } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import DownLoadModal from "./DownLoadModal";

export default observer(function ContentView() {
  const {
    fileData,
    activePath,
    onReset,
    selectedNode,
    mark,
    unMark,
    getTags,
    getPublicFactorTree,
    onSelectedNodeChange,
  } = useStores().publicFactorStore;
  const [path, setPath] = useState("");
  const [downloadVisible, setDownloadVisible] = useState(false);

  useUnmount(() => {
    onReset();
  });

  const onCopy = async () => {
    if (!fileData) return;
    await copy(fileData?.data);
    message.success("复制成功");
  };

  const onMarkClick = async () => {
    if (!selectedNode) return;
    if (selectedNode.isMarked) {
      await unMark(selectedNode.path);
      getPublicFactorTree();
      onSelectedNodeChange({
        ...selectedNode,
        isMarked: false,
        markCount: --selectedNode.markCount,
      });
    } else {
      await mark(selectedNode.path);
      getPublicFactorTree();
      onSelectedNodeChange({
        ...selectedNode,
        isMarked: true,
        markCount: ++selectedNode.markCount,
      });
    }
  };

  const onDownloadClick = async () => {
    if (!selectedNode) return;
    await getTags();
    setPath(selectedNode.path);
    setDownloadVisible(true);
  };

  const getExtra = () => {
    if (fileData?.type !== "md") return;
    return (
      <Space>
        <Button
          icon={
            <IconFont
              style={{ color: "orange", fontSize: 18 }}
              type={selectedNode?.isMarked ? "shoucang1" : "shoucang"}
            />
          }
          onClick={onMarkClick}
        >
          {selectedNode?.markCount} 收藏
        </Button>
        <Permission code="B070101" disabled>
          <Button
            icon={<DownloadOutlined style={{ fontSize: 18 }} />}
            type="primary"
            onClick={onDownloadClick}
          >
            下载
          </Button>
        </Permission>
      </Space>
    );
  };

  return (
    <Card
      title={activePath}
      className={`${clsPrefix}-research-content`}
      extra={getExtra()}
    >
      {fileData ? (
        <>
          {fileData.type === "md" && <Markdown data={fileData.data} />}
          {fileData.type === "code" && (
            <CodeMirror
              value={fileData.data}
              theme={materialLight}
              extensions={[python()]}
              height="100%"
              style={{ height: "100%" }}
              editable={false}
            />
          )}
          {fileData.type === "code" && (
            <Button
              type="link"
              onClick={onCopy}
              className={`${clsPrefix}-research-content-copyBtn`}
            >
              <Tooltip title="复制">
                <CopyOutlined />
              </Tooltip>
            </Button>
          )}
        </>
      ) : (
        <Empty
          style={{ marginTop: 200 }}
          description="请先选择文件查看具体内容"
        />
      )}

      <DownLoadModal
        path={path}
        visible={downloadVisible}
        onVisibleChange={(value) => setDownloadVisible(value)}
      />
    </Card>
  );
});
