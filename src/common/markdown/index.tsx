import { Empty } from "antd";
import "github-markdown-css";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./index.less";
// 高亮的主题，还有很多别的主题，可以自行选择

interface MarkdownProps {
  data: string;
  emptyText?: string;
}

export default function Markdown(props: MarkdownProps) {
  const { data, emptyText = "内容为空" } = props;

  if (!data) {
    return <Empty description={emptyText} style={{ marginTop: 50 }} />;
  }
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      className="text-black bg-white markdown-body"
    >
      {data}
    </ReactMarkdown>
  );
}
