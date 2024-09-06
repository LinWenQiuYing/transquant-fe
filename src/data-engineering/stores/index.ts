import DataManageStore from "./DataManage";
import EnvironmentManageStore from "./EnvironmentManage";
import ProjectManageStore from "./ProjectManage";
import SourceCenterStore from "./SourceCenter";

const stores = {
  dataManageStore: new DataManageStore(),
  projectManageStore: new ProjectManageStore(),
  sourceCenterStore: new SourceCenterStore(),
  environmentManageStore: new EnvironmentManageStore(),
};

export default stores;
