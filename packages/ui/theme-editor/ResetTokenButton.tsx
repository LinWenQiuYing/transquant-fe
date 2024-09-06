import { defaultTheme } from "@transquant/constants";
import { MutableTheme } from "@transquant/utils";
import { theme as antdTheme, Typography } from "antd";
import { AliasToken } from "antd/es/theme/internal";
import React from "react";

interface ResetTokenButtonProps {
  tokenName: keyof Partial<AliasToken>;
  theme: MutableTheme;
  style?: React.CSSProperties;
}

export default function ResetTokenButton(props: ResetTokenButtonProps) {
  const { tokenName, theme, style } = props;
  const { token } = antdTheme.useToken();

  const showReset =
    theme.token?.[tokenName] !== defaultTheme.token?.[tokenName];

  return (
    <div style={{ display: "inline-block", ...style }}>
      <Typography.Link
        style={{
          fontSize: 12,
          color: token.red,
          padding: 0,
          opacity: showReset ? 1 : 0,
          pointerEvents: showReset ? "auto" : "none",
        }}
        onClick={() => theme.onAbort?.(tokenName)}
      >
        重置
      </Typography.Link>
    </div>
  );
}
