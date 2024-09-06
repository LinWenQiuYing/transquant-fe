export interface PublicFactorTree {
  canDownload: boolean;
  children: PublicFactorTree[];
  fileType: "file" | "directory";
  isMarked: boolean;
  markCount: number;
  name: string;
  path: string;
}
