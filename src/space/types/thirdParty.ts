export interface LabEnvItem {
  id: number;
  name: string;
  token: string;
}

export interface PythonModuleItem {
  moduleName: string;
  moduleVersion: string;
}

export interface PythonModule {
  pythonModuleList: PythonModuleItem[];
  total: number;
}
