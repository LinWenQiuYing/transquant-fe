import { Permission } from "@transquant/ui";
import ProjectList from "@transqunat/data-engineering/project-manage/project-list";

export default function EmpowerManage() {
  return (
    <Permission code="etlProjectManage">
      <ProjectList fromManage />
    </Permission>
  );
}
