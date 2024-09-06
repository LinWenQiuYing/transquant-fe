/* eslint-disable camelcase */
/* eslint-disable no-return-await */
import { paths } from "@transquant/constants";
import {
  App,
  Approval,
  ApprovalRecord,
  DataManage,
  DataResource,
  Datasource,
  Doc,
  EmpowerManage,
  Env,
  Environment,
  EnvironmentManage,
  Factor,
  FactorIncreTracking,
  FactorView,
  GroupFactor,
  GroupFactorView,
  GroupStrategy,
  GroupStrategyView,
  Home,
  Image,
  Label,
  Log,
  Login,
  Message,
  Organization,
  Page404,
  Person,
  PrivateFactorIncre,
  PrivateStrategyIncre,
  ProjectDetail,
  ProjectManage,
  Publish,
  PublishView,
  Research,
  SchedulerCreate,
  ShareSpace,
  ShareSpaceView,
  SourceCenter,
  Strategy,
  StrategyGroupIcreTracking,
  StrategyIncreTracking,
  StrategyView,
  System,
  TeamFactorIncre,
  TeamStrategyIncre,
  Third,
  TransChaosView,
  User,
  UserGroup,
} from "./Page";

export interface Router {
  index?: boolean;
  path: string;
  children?: Router[];
  component: any;
}

const {
  login,
  transmatrix,
  transchaos,
  doc,
  env,
  environmentManage,
  factor,
  shareSpace,
  strategy,
  third,
  user,
  organization,
  approval,
  image,
  log,
  userGroup,
  system,
  person,
  publish,
  label,
  message,
  data,
  scheduler_create,
  publicFactor,
  groupFactor,
  groupStrategy,
  share,
  home,
  environment,
  source,
  dataManage,
  projectManage,
  datasource,
  empower,
  factorIncre,
  strategyIncre,
  groupFactorIncre,
  groupStrategyIncre,
} = paths;

const router: Router[] = [
  {
    path: "/",
    component: Login,
    children: [
      {
        path: login,
        index: true,
        component: Login,
      },
    ],
  },
  {
    path: transmatrix,
    component: App,
    children: [
      { path: home, component: Home },
      { path: env, component: Env },
      {
        path: factor,
        component: Factor,
        children: [
          {
            path: `${factor}/:id`,
            component: FactorView,
          },
        ],
      },
      {
        path: strategy,
        component: Strategy,
        children: [
          {
            path: `${strategy}/:id`,
            component: StrategyView,
          },
        ],
      },
      {
        path: factorIncre,
        component: PrivateFactorIncre,
        children: [
          {
            path: `${factorIncre}/:increid`,
            component: FactorIncreTracking,
          },
        ],
      },
      {
        path: strategyIncre,
        component: PrivateStrategyIncre,
        children: [
          {
            path: `${strategyIncre}/:increid`,
            component: StrategyIncreTracking,
          },
        ],
      },
      { path: third, component: Third },
      { path: data, component: DataResource },
      { path: publicFactor, component: Research },
      { path: scheduler_create, component: SchedulerCreate },
      { path: source, component: SourceCenter },
      { path: dataManage, component: DataManage },
      {
        path: projectManage,
        component: ProjectManage,
        children: [
          {
            path: `${projectManage}/:id/:name?/:action?/:code?`,
            component: ProjectDetail,
          },
        ],
      },
      { path: environmentManage, component: EnvironmentManage },
      { path: user, component: User },
      { path: userGroup, component: UserGroup },
      { path: organization, component: Organization },
      {
        path: approval,
        component: Approval,
        children: [{ path: `${approval}/:id`, component: ApprovalRecord }],
      },
      { path: image, component: Image },
      { path: environment, component: Environment },
      { path: log, component: Log },
      { path: system, component: System },
      { path: datasource, component: Datasource },
      { path: empower, component: EmpowerManage },
      { path: person, component: Person },
      {
        path: publish,
        component: Publish,
        children: [{ path: `${publish}/:type/:id`, component: PublishView }],
      },
      { path: label, component: Label },
      { path: message, component: Message },
      {
        path: groupFactor,
        component: GroupFactor,
        children: [{ path: `${groupFactor}/:id`, component: GroupFactorView }],
      },
      {
        path: groupStrategy,
        component: GroupStrategy,
        children: [
          { path: `${groupStrategy}/:id`, component: GroupStrategyView },
        ],
      },
      {
        path: groupFactorIncre,
        component: TeamFactorIncre,
        children: [
          {
            path: `${groupFactorIncre}/:increid`,
            component: StrategyGroupIcreTracking,
          },
        ],
      },
      {
        path: groupStrategyIncre,
        component: TeamStrategyIncre,
        children: [
          {
            path: `${groupStrategyIncre}/:increid`,
            component: StrategyGroupIcreTracking,
          },
        ],
      },
      {
        path: share,
        component: ShareSpace,
      },
      { path: "*", component: Page404 },
    ],
  },
  { path: `${transchaos}/*`, component: TransChaosView },
  { path: `${doc}/*`, component: Doc },
  {
    path: `${shareSpace}/:shareId`,
    component: ShareSpaceView,
  },
];

export default router;
