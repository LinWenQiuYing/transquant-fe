import { CloseOutlined } from "@ant-design/icons";
import { MutableTheme } from "@transquant/utils/hooks/useTheme";
import {
  Button,
  Col,
  ColorPicker,
  ColorPickerProps,
  Drawer,
  InputNumber,
  List,
  Row,
  Slider,
  Space,
  ThemeConfig,
  Tooltip,
  Typography,
} from "antd";
import i18n from "i18next";
import { useState } from "react";
import EditorModal from "./EditorModal";
import { TokenCategory, TokenGroupWithRange } from "./interface";
import { categories } from "./meta/category";

import ResetTokenButton from "./ResetTokenButton";

export interface TQEditorProps {
  theme: MutableTheme;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default function TQEditor(props: TQEditorProps) {
  const { visible, onVisibleChange, theme } = props;
  const [editVisible, setEditVisible] = useState(false);

  const getColorRender = (category: TokenCategory) => {
    return (
      <List
        dataSource={category.groups}
        renderItem={(item) => (
          <Row justify="space-between" style={{ lineHeight: "56px" }}>
            <Col>
              <Tooltip title={item.desc}>
                <span>{item.name}</span>
              </Tooltip>
              <ResetTokenButton
                style={{ marginLeft: 8 }}
                theme={theme}
                tokenName={item.seedToken}
              />
            </Col>
            <Col>
              <ColorPicker
                value={
                  theme.token?.[item.seedToken] as ColorPickerProps["value"]
                }
                onChange={(_, hex) =>
                  theme.onThemeChange?.(item.seedToken, hex)
                }
                showText
              />
            </Col>
          </Row>
        )}
      />
    );
  };

  const getSizeRender = (category: TokenCategory) => {
    return (
      <List
        dataSource={category.groups as TokenGroupWithRange[]}
        renderItem={(item) => (
          <Row justify="space-between" style={{ lineHeight: "56px" }}>
            <Col>
              <Tooltip title={item.desc}>
                <span>{item.name}</span>
              </Tooltip>
              <ResetTokenButton
                style={{ marginLeft: 8 }}
                theme={theme}
                tokenName={item.seedToken}
              />
            </Col>
            <Col>
              <Space>
                <Slider
                  style={{ width: "100px" }}
                  min={item.min}
                  max={item.max}
                  value={theme.token?.[item.seedToken] as number}
                  onChange={(value) =>
                    theme.onThemeChange?.(item.seedToken, value)
                  }
                />
                <InputNumber
                  min={item.min}
                  max={item.max}
                  value={theme.token?.[item.seedToken] as number}
                  onChange={(value) =>
                    theme.onThemeChange?.(item.seedToken, value!)
                  }
                />
              </Space>
            </Col>
          </Row>
        )}
      />
    );
  };

  const onOk = (themeJson: ThemeConfig["token"] = {}) => {
    theme.onImportTheme?.(themeJson);
    setEditVisible(false);
  };

  const onLangChange = () => {
    const lang = theme.lang === "en" ? "zh" : "en";
    theme.onThemeChange?.("lang", lang);
    i18n.changeLanguage(lang);
  };

  return (
    <Drawer
      title="TQ主题配置"
      placement="right"
      destroyOnClose
      onClose={() => onVisibleChange(false)}
      open={visible}
      closable={false}
      width={500}
      extra={
        <Space>
          <Button onClick={() => setEditVisible(true)}>主题配置</Button>
          <Button
            type="text"
            icon={theme.lang === "zh" ? "中" : "EN"}
            onClick={onLangChange}
          />
          <CloseOutlined onClick={() => onVisibleChange(false)} />
        </Space>
      }
    >
      <List
        dataSource={categories}
        renderItem={(category) => (
          <Space direction="vertical" size={0} style={{ width: "100%" }}>
            <Typography.Text disabled>
              <Tooltip title={category.desc}>{category.name}</Tooltip>
            </Typography.Text>
            {category.type === "Color" && getColorRender(category)}
            {(category.type === "Size" || category.type === "Style") &&
              getSizeRender(category)}
          </Space>
        )}
      />
      <EditorModal
        open={editVisible}
        theme={theme.token}
        onOk={onOk}
        onCancel={() => setEditVisible(false)}
        onReset={theme.onReset}
      />
    </Drawer>
  );
}
