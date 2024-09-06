import { MoreOutlined } from "@ant-design/icons";
import { Label } from "@transquant/ui";
import { isNull, isString } from "@transquant/utils";
import { Popover, Space, Tag } from "antd";

interface PopoverTagProps {
  tags: Label[] | string[] | null;
}

const mapToLabel = (tags: string[]) => {
  return tags.map((item) => ({ id: item, name: item }));
};

export default function PopoverTag(props: PopoverTagProps) {
  let { tags } = props;
  tags = (tags || []).filter(
    (item) => item !== null
  ) as PopoverTagProps["tags"];

  if (isNull(tags)) {
    tags = [];
  }

  if (!tags.length) return null;

  tags = (isString(tags[0]) ? mapToLabel(tags as string[]) : tags) as Label[];
  const showItems = tags.slice(0, 3);

  return (
    <div style={{ display: "flex", flexWrap: "nowrap" }}>
      {showItems.map((tag) => {
        return (
          <Tag bordered={false} key={tag.id} title={tag.name}>
            {tag.name.length > 6
              ? tag.name.slice(0, 6).concat("...")
              : tag.name}
          </Tag>
        );
      })}
      {tags.length > 3 && (
        <Popover
          content={
            <Space style={{ width: 300 }} wrap>
              {tags.map((item) => (
                <Tag bordered={false} key={item.id}>
                  {item.name}
                </Tag>
              ))}
            </Space>
          }
        >
          <MoreOutlined
            style={{ transform: "rotate(90deg)", cursor: "pointer" }}
          />
        </Popover>
      )}
    </div>
  );
}
