import type { Cell, Graph } from "@antv/x6";
import { useEffect, useState } from "react";

interface Options {
  graph?: Graph;
}

/**
 * Get position of the right-clicked Cell.
 */
export function useNodeMenu(options: Options) {
  const { graph } = options;

  const [nodeVariables, setNodeVariables] = useState({
    menuVisible: false,
    startModalShow: false,
    logTaskId: -1,
    logTaskType: "",
    pageX: 0,
    pageY: 0,
    menuCell: {} as Cell,
    showModalRef: false,
    row: {},
    logRef: "",
    logLoadingRef: true,
    skipLineNum: 0,
    limit: 1000,
    taskCode: "",
  });

  const menuHide = () => {
    setNodeVariables({ ...nodeVariables, menuVisible: false });

    // unlock scroller
    graph?.unlockScroller();
  };

  const menuStart = (code: number) => {
    setNodeVariables({
      ...nodeVariables,
      startModalShow: true,
      taskCode: String(code),
    });
  };

  const viewLog = (taskId: number, taskType: string) => {
    setNodeVariables({
      ...nodeVariables,
      logTaskId: taskId,
      logTaskType: taskType,
      showModalRef: true,
    });
  };

  useEffect(() => {
    if (graph) {
      // contextmenu
      graph.on("node:contextmenu", ({ cell, x, y }) => {
        const data = graph.localToPage(x, y);

        setNodeVariables({
          ...nodeVariables,
          menuCell: cell,
          pageX: data.x,
          pageY: data.y,
          menuVisible: true,
        });

        // lock scroller
        graph.lockScroller();
      });
    }
  }, [graph]);

  return {
    nodeVariables,
    menuHide,
    menuStart,
    viewLog,
  };
}

export default {};
