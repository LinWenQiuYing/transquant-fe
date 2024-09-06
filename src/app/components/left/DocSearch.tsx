import { SearchOutlined } from "@ant-design/icons";
import { clsPrefix, paths } from "@transquant/constants";
import { Esc } from "@transquant/utils";
import { useMount } from "ahooks";
import { Empty, Select, SelectProps } from "antd";
import classNames from "classnames";
import { BaseSelectRef } from "rc-select";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type HotKeyDescription = {
  key: string;
  altKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

interface DocSearchProps {
  data?: Record<string, Array<{ text: ReactNode; href: string }>>;
  hotKey?: HotKeyDescription;
}

const defalt = {
  开始研究: [
    {
      text: "研究环境",
      href: paths.env,
    },
  ],
  更多: [{ text: "个人中心", href: paths.person }],
};

export default function DocSearch(props: DocSearchProps) {
  const { data = defalt, hotKey = { key: "k", metaKey: true } } = props;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const selectRef = useRef<BaseSelectRef>(null);

  const focus = () => {
    if (!selectRef.current) return;
    selectRef.current.focus();
  };

  const globalHotKeyHandle = useCallback((event: KeyboardEvent) => {
    if (event.key === Esc.key) {
      setOpen(false);
      return;
    }

    let needShow = true;
    Object.entries(hotKey).forEach(([param, value]) => {
      if (event[param as keyof KeyboardEvent] !== value) {
        needShow = false;
      }
    });

    if (needShow) {
      focus();
      setOpen(true);
    }
  }, []);

  useMount(() => {
    window.addEventListener("keydown", globalHotKeyHandle);

    return () => {
      window.removeEventListener("keydown", globalHotKeyHandle);
    };
  });

  const onSelectChange: SelectProps["onChange"] = (path) => {
    navigate(path);
  };

  const selectChildren = useMemo(() => {
    return Object.entries(data).map(([title, options], index) => {
      return (
        <Select.OptGroup key={index} label={title}>
          {options.map(({ text, href }, index) => (
            <Select.Option
              key={href}
              value={href}
              className={classNames("select-option-item", {
                [`${clsPrefix}-option-tail`]: index === options.length - 1,
              })}
            >
              {text}
            </Select.Option>
          ))}
        </Select.OptGroup>
      );
    });
  }, [data]);

  return (
    <Select
      showSearch
      open={open}
      ref={selectRef}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      value={null}
      placeholder="⌘ + K 搜索"
      suffixIcon={<SearchOutlined />}
      style={{ width: 240 }}
      onChange={onSelectChange}
      className={`${clsPrefix}-left-doc-search mb-5`}
      notFoundContent={
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="未找到相关内容"
        />
      }
    >
      {selectChildren}
    </Select>
  );
}
