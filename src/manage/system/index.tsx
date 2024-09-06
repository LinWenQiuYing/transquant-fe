import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { clsPrefix, collapsedStyle, normalStyle } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { Space } from "antd";
import { observer } from "mobx-react";
import { useStores as useManageStores } from "../hooks";
import Image from "../image";
import EnvSetting from "./EnvSetting";
import EnvTemplateTable from "./EnvTemplateTable";
import { defaultRoutes } from "./helpers";
import PIPTable from "./PIPTable";
import SystemTemplateTable from "./SystemTemplateTable";
import TransmatrixInstall from "./TransmatrixInstall";

export default observer(function SystemManage() {
  const { collapsed } = useStores().appStore;
  const {
    templateList,
    envTemplateList,
    addEnvTemplate,
    getEnvTemplates,
    updateEnvTemplate,
    deleteEnvTemplate,
    addCommonTemplateFile,
    getCommonTemplate,
    deleteGroupTemplateFile,
    downloadTemplateZip,
    pipList,
    getPipUrl,
    addOrUpdatePip,
  } = useManageStores().systemStore;

  const getBreadcrumbItems = () => {
    const items: BreadcrumbItem[] = defaultRoutes;

    return items;
  };

  return (
    <Permission code="system">
      <ContentPanel
        title={
          <TitlePanel
            items={getBreadcrumbItems()}
            style={collapsed ? collapsedStyle : normalStyle}
          />
        }
        className={`${clsPrefix}-system`}
        portalCard={false}
        content={
          <Space direction="vertical">
            <TransmatrixInstall />
            {/* <TransmatrixTable /> */}
            <SystemTemplateTable
              templates={templateList as any}
              addTemplate={addCommonTemplateFile}
              getAllTemplates={getCommonTemplate}
              deleteTemplate={deleteGroupTemplateFile}
              downloadFn={downloadTemplateZip}
            />
            <PIPTable
              templates={pipList}
              addTemplate={addOrUpdatePip}
              getAllTemplates={getPipUrl}
            />
            <Image />
            <EnvSetting />
            <EnvTemplateTable
              templates={envTemplateList}
              addTemplate={addEnvTemplate}
              getAllTemplates={getEnvTemplates}
              deleteTemplate={deleteEnvTemplate}
              updateTemplate={updateEnvTemplate}
            />
          </Space>
        }
      />
    </Permission>
  );
});
