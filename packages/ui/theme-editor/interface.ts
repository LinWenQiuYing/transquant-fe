import { AliasToken } from "antd/es/theme/internal";

export type TokenGroup = {
  name: string;
  desc: string;
  seedToken: keyof Partial<AliasToken>;
};

export type TokenGroupWithRange = TokenGroup & {
  min: number;
  max: number;
};

export type TokenCategory = {
  name: string;
  desc: string;
  type: string;
  groups: (TokenGroup | TokenGroupWithRange)[];
};

export default {};
