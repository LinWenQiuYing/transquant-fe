import { CommitOptions } from "@gitgraph/js";
import { Gitgraph } from "@gitgraph/react";
import { Modal } from "antd";
import dayjs from "dayjs";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import { useStores } from "../../hooks";

interface CommitModalProps {
  shareId: string;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default observer(function CommitModal(props: CommitModalProps) {
  const { visible, onVisibleChange, shareId } = props;
  const { gitlog, resetSoftCode, resetLoading } = useStores().shareStore;

  const gitgraphOptions: CommitOptions[] = toJS(gitlog).map((item) => ({
    ...item,
    renderMessage(commit) {
      return React.createElement(
        "g",
        null,

        React.createElement(
          "foreignObject",
          { width: "460", x: "10" },
          React.createElement(
            "text",
            {
              y: commit.style.dot.size,
              alignmentBaseline: "central",
              fill: commit.style.dot.color,
              onContextMenu: (e) => {
                e.preventDefault();
                Modal.confirm({
                  title: (
                    <div>
                      是否回退到「
                      <span style={{ color: "var(--red-600)" }}>
                        {commit.hashAbbrev}
                      </span>
                      」分支
                    </div>
                  ),
                  onOk() {
                    resetSoftCode({ commitId: commit.hash, shareId });
                    onVisibleChange(false);
                  },
                  okButtonProps: { loading: resetLoading },
                });
              },
            },
            commit.hashAbbrev,
            " - ",
            commit.subject,
            "-",
            commit.author.name,
            "-",
            dayjs(item.author.timestamp).format("YYYY-MM-DD:hh:mm:ss")
          )
        )
      ) as unknown as SVGAElement;
    },
  }));

  return (
    <Modal
      title="提交代码"
      open={visible}
      onCancel={() => onVisibleChange(false)}
      destroyOnClose
      width={800}
      styles={{
        body: {
          height: 600,
          overflow: "auto",
        },
      }}
    >
      {React.createElement(Gitgraph, null, function (gitgraph: any) {
        gitgraph.import(gitgraphOptions);
      } as unknown as ReactNode)}
    </Modal>
  );
});
