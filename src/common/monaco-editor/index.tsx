import { AssetsJs } from "@transquant/constants";
import { LiteralUnion, useLoadjs } from "@transquant/utils";
import { useEffect, useRef } from "react";

declare let monaco: any;

interface MonacoEditorProps {
  value?: string;
  language?: LiteralUnion<"sql">;
  onChange?: (value: string) => void;
}

export default function MonacoEditor(props: MonacoEditorProps) {
  const { value = "", language = "sql", onChange } = props;
  const containerRef = useRef(null);
  const monacoInstance = useRef<any>(null);

  const isReady = useLoadjs("monaco-editor", [
    `${AssetsJs}/monaco-editor/monaco.min.js`,
    `${AssetsJs}/monaco-editor/main.css`,
  ]);

  useEffect(() => {
    if (!isReady || !containerRef.current) return;

    monacoInstance.current = monaco?.editor?.create(containerRef.current, {
      value,
      language,
      automaticLayout: true,
      scrollbar: {
        alwaysConsumeMouseWheel: false,
      },
    });

    return () => {
      monacoInstance.current.dispose();
    };
  }, [isReady]);

  useEffect(() => {
    const cursor = monacoInstance.current?.getPosition();
    monacoInstance.current?.setValue(value);
    monacoInstance.current?.setPosition(cursor);
  }, [value]);

  monacoInstance?.current?.onDidChangeModelContent(() => {
    const value = monacoInstance.current?.getValue() || "";

    onChange?.(value);
  });

  return (
    <div
      style={{
        height: "100%",
        minHeight: "200px",
      }}
      ref={containerRef}
    />
  );
}
