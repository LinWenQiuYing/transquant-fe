import { TokenCategory } from "../interface";

export const categories: TokenCategory[] = [
  {
    name: "颜色",
    desc: "",
    type: "Color",
    groups: [
      {
        name: "品牌色",
        desc: "代表品牌身份、品牌形象和品牌价值观的颜色",
        seedToken: "colorPrimary",
      },
      {
        name: "基础文本色",
        desc: "用于派生文本色梯度的基础变量",
        seedToken: "colorTextBase",
      },
      {
        name: "基础背景色",
        desc: "用于派生背景色梯度的基础变量",
        seedToken: "colorBgBase",
      },
      {
        name: "成功色",
        desc: "表示成功、完成或者达成目标等积极意义的颜色",
        seedToken: "colorSuccess",
      },
      {
        name: "警戒色",
        desc: "表示警示、提醒等负面信息的颜色",
        seedToken: "colorWarning",
      },
      {
        name: "错误色",
        desc: "表示失败、未完成或者错误等负面信息的颜色",
        seedToken: "colorError",
      },
      {
        name: "链接色",
        desc: "表示链接的颜色，默认跟随信息色",
        seedToken: "colorLink",
      },
    ],
  },
  {
    name: "尺寸",
    desc: "",
    type: "Size",
    groups: [
      {
        name: "文字",
        desc: "控制文本字体大小",
        seedToken: "fontSize",
        min: 12,
        max: 32,
      },
      {
        name: "尺寸步长",
        desc: "用于控制组件尺寸的基础步长",
        seedToken: "sizeStep",
        min: 0,
        max: 16,
      },
    ],
  },
  {
    name: "风格",
    desc: "",
    type: "Style",
    groups: [
      {
        name: "圆角",
        desc: "基础组件的圆角大小，例如按钮、输入框、卡片等",
        seedToken: "borderRadius",
        min: 0,
        max: 16,
      },
    ],
  },
];

export default {};
