export type ApprovalItem = {
  auditor: string;
  commitTime: string;
  id: number;
  order: string;
  projectName: string;
  projectType: number;
  publisher: string;
  reason: string;
  status: number;
  targetTeamName: string;
};

export type Approval = {
  list: ApprovalItem[];
  total: number;
};
