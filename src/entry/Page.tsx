import type { AnyObject, LoaderType } from "@transquant/utils";
import { Loadable } from "@transquant/utils";

const loading = <div />;

const loader = <T extends AnyObject = any>(
  com: () => ReturnType<LoaderType<T>>
) => Loadable({ loader: com, loading });

export const Login = loader(() => import("@transquant/login"));
export const Doc = loader(() => import("@transquant/docs"));
export const App = loader(() => import("@transquant/app"));
export const Home = loader(() => import("@transquant/space/home"));
export const Env = loader(() => import("@transquant/space/env"));
export const Factor = loader(
  () => import("@transquant/space/personal/factor-research")
);
export const FactorView = loader(
  () => import("@transquant/space/personal/factor-research/factor-view")
);
export const Strategy = loader(
  () => import("@transquant/space/personal/strategy-research")
);
export const StrategyView = loader(
  () => import("@transquant/space/personal/strategy-research/strategy-view")
);
export const PrivateFactorIncre = loader(
  () => import("@transquant/space/personal/factor-incre")
);
export const PrivateStrategyIncre = loader(
  () => import("@transquant/space/personal/strategy-incre")
);
export const FactorIncreTracking = loader(
  () => import("@transquant/space/personal/factor-incre/incre-tracking-view")
);
export const StrategyIncreTracking = loader(
  () => import("@transquant/space/personal/strategy-incre/incre-tracking-view")
);
export const FactorGroupIncreTracking = loader(
  () => import("@transquant/space/group/factor-incre/incre-tracking-view")
);
export const StrategyGroupIcreTracking = loader(
  () => import("@transquant/space/group/strategy-incre/incre-tracking-view")
);
export const TeamFactorIncre = loader(
  () => import("@transquant/space/group/factor-incre")
);
export const TeamStrategyIncre = loader(
  () => import("@transquant/space/group/strategy-incre")
);
export const Third = loader(() => import("@transquant/space/third-party"));
export const DataResource = loader(
  () => import("@transquant/space/data-resource")
);
export const Research = loader(
  () => import("@transquant/space/research-resource/public-factor")
);
export const User = loader(() => import("@transquant/manage/user"));
export const UserGroup = loader(() => import("@transquant/manage/user-group"));
export const Organization = loader(
  () => import("@transquant/manage/organization")
);
export const Approval = loader(() => import("@transquant/manage/approval"));
export const ApprovalRecord = loader(
  () => import("@transquant/person/publish/record-view")
);
export const Image = loader(() => import("@transquant/manage/image"));
export const Log = loader(() => import("@transquant/manage/audit-log"));
export const Environment = loader(
  () => import("@transquant/manage/environment")
);
export const System = loader(() => import("@transquant/manage/system"));
export const Person = loader(() => import("@transquant/person/profile"));
export const Publish = loader(() => import("@transquant/person/publish"));
export const PublishView = loader(
  () => import("@transquant/person/publish/record-view")
);
export const Label = loader(() => import("@transquant/person/label"));
export const Message = loader(() => import("@transquant/person/message"));
export const GroupFactor = loader(
  () => import("@transquant/space/group/factor")
);
export const GroupFactorView = loader(
  () => import("@transquant/space/group/factor/factor-view")
);
export const GroupStrategy = loader(
  () => import("@transquant/space/group/strategy")
);
export const ShareSpace = loader(() => import("@transquant/space/share-space"));
export const ShareSpaceView = loader(
  () => import("@transquant/space/share-space/share-space-view")
);
export const GroupStrategyView = loader(
  () => import("@transquant/space/group/strategy/strategy-view")
);
export const Page404 = loader(() => import("@transquant/ui/result/404"));
export const TransChaosView = loader(
  () => import("@transquant/app/components/TransChaos")
);

export const SourceCenter = loader(
  () => import("@transqunat/data-engineering/source-center")
);
export const DataManage = loader(
  () => import("@transqunat/data-engineering/data-manage")
);
export const ProjectManage = loader(
  () => import("@transqunat/data-engineering/project-manage")
);
export const EnvironmentManage = loader(
  () => import("@transqunat/data-engineering/environment-manage")
);
export const ProjectDetail = loader(
  () => import("@transqunat/data-engineering/project-manage/project-detail")
);

export const SchedulerCreate = loader(
  () => import("@transquant/scheduler/scheduler-create")
);

export const Datasource = loader(
  () => import("@transquant/manage/data-engineering/datasource")
);

export const EmpowerManage = loader(
  () => import("@transquant/manage/data-engineering/empower")
);
