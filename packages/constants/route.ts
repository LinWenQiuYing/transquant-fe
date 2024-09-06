// flp => firstLevelPaths
// slp => secondLevelPaths
// tlp => thirdLevelPaths

const flp = {
  /** 登陆页 */
  login: "/login",
  /** transmatrix */
  transmatrix: "/transmatrix",
  /** transchaos */
  transchaos: "/transchaos",
  /** chat */
  chat: "/chat",
  /** doc */
  doc: "/doc",
  /** share */
  shareSpace: "/shareSpace",
};

const slp = {
  /** 开始研究 */
  home: `${flp.transmatrix}/home`,
  env: `${flp.transmatrix}/env`,
  factor: `${flp.transmatrix}/factor`,
  strategy: `${flp.transmatrix}/strategy`,
  factorIncre: `${flp.transmatrix}/factorIncre`,
  strategyIncre: `${flp.transmatrix}/strategyIncre`,
  groupFactor: `${flp.transmatrix}/groupFactor`,
  groupStrategy: `${flp.transmatrix}/groupStrategy`,
  groupFactorIncre: `${flp.transmatrix}/teamFactorIncre`,
  groupStrategyIncre: `${flp.transmatrix}/teamStrategyIncre`,
  share: `${flp.transmatrix}/share`,
  third: `${flp.transmatrix}/thrid`,
  data: `${flp.transmatrix}/data`,
  publicFactor: `${flp.transmatrix}/publicFactor`,
  scheduler: `${flp.transmatrix}/scheduler`,

  /** 数据工程 */
  source: `${flp.transmatrix}/data-source`,
  dataManage: `${flp.transmatrix}/data-manage`,
  projectManage: `${flp.transmatrix}/project-manage`,
  environmentManage: `${flp.transmatrix}/environment-manage`,

  /** 个人中心 */
  person: `${flp.transmatrix}/person`,
  publish: `${flp.transmatrix}/publish`,
  label: `${flp.transmatrix}/label`,
  message: `${flp.transmatrix}/message`,

  /** 管理中心 */
  user: `${flp.transmatrix}/user`,
  userGroup: `${flp.transmatrix}/userGroup`,
  organization: `${flp.transmatrix}/organization`,
  approval: `${flp.transmatrix}/approval`,
  image: `${flp.transmatrix}/image`,
  environment: `${flp.transmatrix}/environment`,
  log: `${flp.transmatrix}/log`,
  system: `${flp.transmatrix}/system`,
  datasource: `${flp.transmatrix}/datasource`,
  empower: `${flp.transmatrix}/empower`,
};

const tlp = {
  scheduler_create: `${slp.scheduler}/create`,
};

export const paths = {
  ...flp,
  ...slp,
  ...tlp,
};

export default {};
