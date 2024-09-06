import GroupEnv from "./GroupEnv";
import ShareSpace from "./ShareSpace";
import SpaceAndDB from "./SpaceAndDB";
import TemplateList from "./TemplateList";

export default function Resource() {
  return (
    <div className="overflow-auto h-[calc(100vh-420px)]">
      <SpaceAndDB />
      <TemplateList />
      <GroupEnv />
      <ShareSpace />
    </div>
  );
}
