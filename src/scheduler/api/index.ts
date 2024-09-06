import { ajax } from "@transquant/utils";
import { IDataBase } from "../dag/types";

interface TypeReq {
  type: IDataBase;
}

interface FullNameReq {
  fullName: string;
}

interface PageReq {
  pageNo: number;
  pageSize: number;
}

interface ResourceTypeReq {
  type: "FILE" | "UDF";
  programType?: string;
}

interface ProcessDefinitionReq {
  name: string;
  locations: string;
  taskDefinitionJson: string;
  taskRelationJson: string;
  executionType: string;
  description?: string;
  globalParams?: string;
  timeout?: number;
}

interface ReleaseStateReq {
  releaseState: "OFFLINE" | "ONLINE";
}

export async function queryDataSourceList(params: TypeReq) {
  return await ajax({
    url: "/tqdata/datasources/list",
    method: "get",
    params,
  });
}

export function createProcessDefinition(
  data: ProcessDefinitionReq,
  projectCode: number
): any {
  return ajax({
    url: `/tqdata/projects/${projectCode}/process-definition`,
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data,
  });
}

export function updateProcessDefinition(
  data: ProcessDefinitionReq & ReleaseStateReq,
  code: number,
  projectCode: number
): any {
  return ajax({
    url: `/tqdata/projects/${projectCode}/process-definition/${code}`,
    method: "put",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data,
  });
}

export function queryProcessInstancesByCode(
  projectCode: number,
  code: number
): any {
  return ajax({
    url: `/tqdata/projects/${projectCode}/process-instances/${code}`,
    method: "get",
  });
}

export function queryProcessDefinitionByCode(
  projectCode: number,
  code: number
): any {
  return ajax({
    url: `/tqdata/projects/${projectCode}/process-definition/${code}`,
    method: "get",
  });
}

export function queryVersions(
  params: PageReq,
  code: number,
  processCode: number
): any {
  return ajax({
    url: `/tqdata/projects/${code}/process-definition/${processCode}/versions`,
    method: "get",
    params,
  });
}

export function switchVersion(
  code: number,
  processCode: number,
  version: number
): any {
  return ajax({
    url: `/tqdata/projects/${code}/process-definition/${processCode}/versions/${version}`,
    method: "get",
  });
}

export function deleteVersion(
  code: number,
  processCode: number,
  version: number
): any {
  return ajax({
    url: `/tqdata/projects/${code}/process-definition/${processCode}/versions/${version}`,
    method: "delete",
  });
}

export function queryProcessInstanceById(
  projectCode: number,
  code: number
): any {
  return ajax({
    url: `/tqdata/projects/${projectCode}/process-instances/${code}`,
    method: "get",
  });
}

export async function queryAllEnvironmentList() {
  return await ajax({
    url: `/tqdata/environment/query-environment-list`,
    method: "get",
  });
}

export async function queryResourceList(params: ResourceTypeReq & FullNameReq) {
  return await ajax({
    url: `/tqdata/resources/list`,
    params,
  });
}

export async function queryAllWorkerGroups() {
  return await ajax({
    url: `/tqdata/worker-groups/all`,
  });
}

export default {};
