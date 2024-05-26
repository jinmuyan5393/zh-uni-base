// ========================验证器============================
// 手机号码的正则表达式
const phoneNumberPattern = /^1[3456789]\d{9}$/;

// 身份证号码正则表达式
const idCardPattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

export function phoneValidate(phoneNumber: any): boolean {
  return phoneNumberPattern.test(phoneNumber);
}

export function idCardValidate(idCard: any): boolean {
  return idCardPattern.test(idCard);
}

export default { phoneValidate };
