import { CopyOutlined } from "@ant-design/icons";
import { python } from "@codemirror/lang-python";
import { clsPrefix } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import { copy, LiteralUnion } from "@transquant/utils";
import { materialLight } from "@uiw/codemirror-theme-material";
import CodeMirror from "@uiw/react-codemirror";
import { Button, Col, Empty, message, Row, Spin, Tooltip, Tree } from "antd";
import type { DataNode as TreeDataNode, TreeProps } from "antd/es/tree";
import { observer } from "mobx-react";
import { useState } from "react";
import { CodeTree } from "../types";
import "./index.less";

type DataNode = TreeDataNode & {
  showPath?: string;
  fileType?: LiteralUnion<"file" | "directory">;
};

const RedStyle = { color: "var(--red-600)" };
const DirectoryIcon = <IconFont type="yinziwenjianjia" style={RedStyle} />;
const FileIcon = <IconFont type="wenjianliebiao" style={RedStyle} />;

const getIcon = (type: LiteralUnion<"file" | "directory">) => {
  let icon = DirectoryIcon;
  if (type === "directory") {
    icon = DirectoryIcon;
  }
  if (type === "file") {
    icon = FileIcon;
  }
  return icon;
};

const getTreeData = (trees: CodeTree[]): DataNode[] => {
  return trees.map((item) => {
    return {
      title: item.name,
      key: item.path,
      showPath: item.showPath,
      fileType: item.fileType,
      children: getTreeData(item.children),
      icon: getIcon(item.fileType),
    };
  });
};

interface CodeFileProps {
  codeTree: CodeTree[];
  codeTreeLoading: boolean;
  getFileContent: (filePath: string) => void;
  fileContent: string;
  fileContentLoading: boolean;
}

export default observer(function CodeFile(props: CodeFileProps) {
  const {
    codeTree,
    codeTreeLoading,
    getFileContent,
    fileContent,
    fileContentLoading,
  } = props;
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [path, setPath] = useState("");

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    const selectedKey = info.node.key;
    let _expandedKeys = expandedKeys;

    if (expandedKeys.includes(selectedKey)) {
      _expandedKeys = expandedKeys.filter((item) => item !== selectedKey);
    } else {
      _expandedKeys = [...expandedKeys, selectedKey];
    }
    setExpandedKeys(_expandedKeys);

    if ((info.node as DataNode).fileType === "directory") {
      return;
    }
    setPath((info.node as DataNode).showPath || "");
    getFileContent(`${info.node.key}`);
  };

  const onCopy = async () => {
    await copy(fileContent);
    message.success("复制成功");
  };

  return (
    <div className={`${clsPrefix}-code-file`}>
      <div>
        <Row>
          <Col style={{ color: "var(--grey-600)", fontWeight: "bold" }}>
            文件分类
          </Col>
        </Row>
        <div className={`${clsPrefix}-code-file-tree`}>
          <Spin spinning={codeTreeLoading}>
            <Tree
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              treeData={getTreeData(codeTree)}
              onSelect={onSelect}
              blockNode
              showIcon
              style={{ overflow: "auto" }}
            />
          </Spin>
        </div>
      </div>
      <div>
        <Row>
          <Col style={{ color: "var(--grey-400)" }}>{path.slice(1)}</Col>
        </Row>
        {path ? (
          <Spin spinning={fileContentLoading}>
            <div className={`${clsPrefix}-code-file-content`}>
              <CodeMirror
                value={fileContent}
                theme={materialLight}
                extensions={[python()]}
                height="100%"
                editable={false}
              />
              <Button
                type="link"
                onClick={onCopy}
                className={`${clsPrefix}-code-file-content-copyBtn`}
              >
                <Tooltip title="复制">
                  <CopyOutlined />
                </Tooltip>
              </Button>
            </div>
          </Spin>
        ) : (
          <Empty description="暂无数据" style={{ marginTop: 180 }} />
        )}
      </div>
    </div>
  );
});
