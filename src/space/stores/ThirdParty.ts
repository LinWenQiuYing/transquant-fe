import { ajax, Nullable } from "@transquant/utils";
import { observable } from "mobx";
import { LabEnvItem, PythonModule } from "../types";

export default class ThirdPartyStore {
  @observable labEnvList: LabEnvItem[] = [];

  @observable pythonModule: Nullable<PythonModule> = null;

  @observable pythonModuleLoading: boolean = false;

  @observable activeEnv: string = "";

  @observable moduleName: string = "";

  onModuleNameChange = (name: string) => {
    this.moduleName = name;
  };

  getJupyterLabEnv = () => {
    ajax({
      url: `/tqlab/thirdParty/getJupyterLabEnv`,
      success: (data) => {
        this.labEnvList = data;
      },
    });
  };

  getPythonModule = ({
    envToken,
    moduleName = "",
    pageNum = 1,
    pageSize = 15,
  }: {
    envToken: string;
    moduleName?: string;
    pageNum?: number;
    pageSize?: number;
  }) => {
    if (!envToken) return;

    this.activeEnv = envToken;
    this.pythonModuleLoading = true;
    ajax({
      url: `/tqlab/thirdParty/getPythonModule`,
      method: "post",
      data: { envToken, moduleName, pageNum, pageSize },
      success: (data) => {
        this.pythonModule = data;
      },
      effect: () => {
        this.pythonModuleLoading = false;
      },
    });
  };

  reset = () => {
    this.labEnvList = [];
    this.pythonModule = null;
  };
}
