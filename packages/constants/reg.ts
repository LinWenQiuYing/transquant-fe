export const nameReg = /^[\u4300-\u9fa5_a-zA-Z0-9]+$/;
export const nameRegMessage = "名称不能为空，且只允许中文、英文、数字、和'_'";
export const nameRegMessageWithoutUppercase =
  "名称不能为空，且只允许英文小写、数字、和'_'";

export const nameWithoutChineseReg = /^[_a-zA-Z0-9]+$/;
export const nameWithoutChineseRegAndUppercase = /^[_a-z0-9]+$/;
export const nameWithoutChineseRegMessage =
  "名称不能为空，且只允许英文、数字、和'_'";

export default {};
