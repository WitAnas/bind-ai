/* eslint-disable import/no-duplicates */

import validationRegex from "./validationRegex";

const isEmpty = (value) => {
  const type = typeof value;
  if (value === null) return true;
  if (type === "undefined") return true;
  if (type === "boolean") return !value;
  if (type === "string") return !value;
  if (type === "number") return false;
  //   if (isFile(value)) return false;
  if (Array.isArray(value)) return !value.length;
  if (type === "object") return !Object.keys(value).length;
  return !value;
};

const isEmail = (value) => {
  if (isDefined(value) && !validationRegex.emailRegex.test(value)) {
    return false;
  }
  return true;
};

const isName = (value) => {
  if (isDefined(value) && !validationRegex.nameRegex.test(value)) {
    return false;
  }
  return true;
};

const isPositiveFloat = (value) => {
  if (isDefined(value) && !validationRegex.floatRegex.test(value)) {
    return false;
  }
  return true;
};

const isPositiveNonzeroFloat = (value) => {
  if (isDefined(value) && !validationRegex.nonzeroFloatRegex.test(value)) {
    return false;
  }
  return true;
};

const isNotFutureDate = (value) => {
  const currentDate = new Date();
  const givenDate = new Date(value);
  if (isDefined(value) && givenDate.getTime() > currentDate.getTime()) {
    return false;
  }
  return true;
};

const isDefined = (obj) => {
  return obj !== null && obj !== undefined;
};

const isDuplicate = (value, ruleValue) => {
  let existingValue = ruleValue;
  let compareValue = value;
  if (typeof ruleValue === "object") {
    existingValue = ruleValue[0];
    compareValue = `+${ruleValue[1]} ${value}`;
  }
  if (isDefined(compareValue) && isDefined(existingValue)) {
    return compareValue === existingValue;
  }
  return false;
};

const isPatternValid = (value, pattern) => {
  if (isDefined(value) && !new RegExp(pattern).test(value)) {
    return false;
  }
  return true;
};

const isMobile = (value) => {
  if (isDefined(value) && !validationRegex.mobileRegex.test(value)) {
    return false;
  }
  return true;
};

const isEmployeeId = (value) => {
  if (isDefined(value) && !validationRegex.employeeIdRegex.test(value)) {
    return false;
  }
  return true;
};

const isValidPassword = (value) => {
  if (isDefined(value) && !validationRegex.passwordRegex.test(value)) {
    return false;
  }
  return true;
};

const isDependentFieldFilled = (fieldName, fieldValue) => {
  if (isDefined(fieldName) && isDefined(fieldValue)) {
    if (!fieldValue) {
      return false;
    }
  }
  return true;
};

const isDeviceNumber = (value) => {
  if (isDefined(value) && !validationRegex.imeiRegex.test(value)) {
    return false;
  }
  return true;
};

const isAfterStartDate = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
};

const isPanCardNumber = (value) => {
  if (isDefined(value) && !validationRegex.alphaNumericRegex.test(value)) {
    return false;
  }
  return true;
};
const isAdhaarCardNumber = (value) => {
  if (isDefined(value) && !validationRegex.adhaarCardRegex.test(value)) {
    return false;
  }
  return true;
};
const isIFSC_Code = (value) => {
  if (isDefined(value) && !validationRegex.ifscCodeRegex.test(value)) {
    return false;
  }
  return true;
};

const isValidLeaveReason = (value) => {
  if (isDefined(value) && value.length < 20) {
    return false;
  }
  return true;
};

export default {
  isEmpty,
  isEmail,
  isName,
  isDuplicate,
  isPatternValid,
  isDefined,
  isPositiveFloat,
  isPositiveNonzeroFloat,
  isNotFutureDate,
  isMobile,
  isEmployeeId,
  isValidPassword,
  isDependentFieldFilled,
  isAfterStartDate,
  isDeviceNumber,
  isPanCardNumber,
  isAdhaarCardNumber,
  isIFSC_Code,
  isValidLeaveReason,
};
