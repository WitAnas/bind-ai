import validationMessages from "@/utils/validations/validationMessages";

export const companyFormValidations = {
  companyName: {
    required: {
      value: true,
      message: validationMessages.isEmpty,
    }
  },
  website: {
    required: {
      value: true,
      message: validationMessages.isEmpty,
    }
  },
  employeeCount:{
    required: {
        value: true,
        message: validationMessages.isEmpty,
      }
  }
};
