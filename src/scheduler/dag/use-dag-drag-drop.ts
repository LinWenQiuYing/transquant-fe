import { ajax } from "@transquant/utils";
import { DragEventHandler, SyntheticEvent, useState } from "react";
import { ContextProps } from "./dag-context";
import { Dragged, TaskType } from "./types";

type Props = ContextProps & {
  appendTask: any;
};

export function genTaskCodeList(num: number, projectCode: number) {
  return ajax({
    url: `/tqdata/projects/${projectCode}/task-definition/gen-task-codes`,
    method: "get",
    params: { genNum: num },
  });
}

export function useDagDrapAndDrop(props: Props) {
  const { readonly, graph, appendTask } = props;
  const [dragged, setDragged] = useState<Dragged>({
    x: 0,
    y: 0,
    type: "SQL",
  });

  const onDragStart = (e: SyntheticEvent<HTMLDivElement>, type: TaskType) => {
    if (readonly) {
      e.preventDefault();
      return;
    }

    const nativeEvent = e.nativeEvent as unknown as {
      offsetX: number;
      offsetY: number;
    };

    setDragged({
      x: nativeEvent.offsetX,
      y: nativeEvent.offsetY,
      type,
    });
  };

  const onDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (readonly) {
      return;
    }

    if (dragged && graph) {
      const { type, x: eX, y: eY } = dragged;
      const { x, y } = graph.clientToLocal(e.clientX, e.clientY);
      const genNums = 1;
      genTaskCodeList(genNums, 10086).then((res) => {
        const [code] = res;
        appendTask(code, type, { x: x - eX, y: y - eY });
      });
    }
  };

  return { onDrop, onDragStart };
}

export default {};
