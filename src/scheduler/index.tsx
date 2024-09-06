import { useParams } from "react-router-dom";
import SchedulerCreate from "./scheduler-create";
import SchedulerDetail from "./scheduler-detail";
import SchedulerInstance from "./scheduler-instance";

const dagViews = {
  "workflow-define_create": <SchedulerCreate />,
  "workflow-define_detail": <SchedulerDetail />,
  "workflow-instance_detail": <SchedulerInstance />,
  "job-instance_instance": <SchedulerInstance />,
};

export default function SDV() {
  const params = useParams();

  if (!params?.action || !params?.name) return null;

  const key = `${params.name}_${params.action}` as keyof typeof dagViews;

  return dagViews[key];
}
