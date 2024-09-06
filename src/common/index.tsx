import RowContentPanel from "./content-panel";
import TitlePanel from "./title-panel";

export type IContentPanel = typeof RowContentPanel & {
  Title: typeof TitlePanel;
};

const ContentPanel = RowContentPanel as IContentPanel;

ContentPanel.Title = TitlePanel;

export { default as JsonView } from "./json-view";
export { default as Markdown } from "./markdown";
export { default as MonacoEditor } from "./monaco-editor";
export { default as AdminPermission } from "./permission";
export { default as PopoverTag } from "./popover-tag";
export { default as TitlePanel } from "./title-panel";
export type { BreadcrumbItem } from "./title-panel";
export { ContentPanel };

export default {};
