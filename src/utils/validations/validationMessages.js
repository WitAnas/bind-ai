const validationMessages = {
  isEmpty: "This field is required",
  isEmail: "Please enter a valid email id",
  isNumber: "Please enter positive numeric values only",
  isNonzeroNumber: "Please enter numeric values greater than zero",
  isText: "Please enter characters only",
  isMobile: "Please enter a valid mobile number",
  isOrganisation: "Please enter a valid name",
  isEmployeeId: "Please enter a valid employee id",
  isPassword: "Please enter a valid password",
  isNotFutureDate: "Please enter a present or past date",
  isDuplicate: "Both fields should have the same value",
  isDeviceNumber: "Please enter a valid IMEI number",
  isAfterStartDate: "The end date should come after start date",
  isPanCard: "Please enter a valid PAN card number",
  isAdhaarCard: "Please enter a valid Adhaar card number",
  isIFSC: "Please enter a valid IFSC code",
  isValidLeaveReason:
    "Leave reason is too short. It should be at least 20 characters",
};

export default validationMessages;
