import { createFromIconfontCN } from "@ant-design/icons";
import { IconFontProps } from "@ant-design/icons/lib/components/IconFont";
import { getAssetsPath } from "@transquant/constants";

export const AssetsFont = getAssetsPath("/font");

const Icon = createFromIconfontCN({
  scriptUrl: [`${AssetsFont}/iconfont.js`],
});

export default function IconFont(props: IconFontProps) {
  return <Icon {...props} type={`icon-${props.type}`} />;
}
