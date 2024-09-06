import ApprovalStore from "./Approval";
import AuditLogStore from "./AuditLog";
import EnvironmentStore from "./Environment";
import ImageStore from "./Image";
import OrganizationStore from "./Organization";
import SystemStore from "./System";
import UserStore from "./User";
import UserGroupStore from "./UserGroup";

const stores = {
  imageStore: new ImageStore(),
  auditLogStore: new AuditLogStore(),
  userStore: new UserStore(),
  organizationStore: new OrganizationStore(),
  systemStore: new SystemStore(),
  approvalStore: new ApprovalStore(),
  environmentStore: new EnvironmentStore(),
  userGroupStore: new UserGroupStore(),
};

export default stores;
