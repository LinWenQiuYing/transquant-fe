import { DragEventHandler, MutableRefObject, useContext } from "react";
import { DagContext } from "./dag-context";
import { useCanvasInit } from "./use-canvas-init";

interface CanvasProps {
  onDrop: DragEventHandler<HTMLDivElement>;
}

export default function Canvas(props: CanvasProps) {
  const { onDrop } = props;
  const { paper, minimap, container } = useCanvasInit(useContext(DagContext));
  const preventDefault: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="relative flex-1"
      ref={container as MutableRefObject<HTMLDivElement>}
      onDrop={onDrop}
      onDragEnter={preventDefault}
      onDragOver={preventDefault}
      onDragLeave={preventDefault}
    >
      <div
        className="w-full h-full"
        ref={paper as MutableRefObject<HTMLDivElement>}
      />
      <div
        className="absolute z-10 border border-gray-300 border-dashed bottom-20 right-4"
        ref={minimap as MutableRefObject<HTMLDivElement>}
      />
    </div>
  );
}
