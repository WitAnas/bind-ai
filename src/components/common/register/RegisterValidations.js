import validationMessages from "@/utils/validations/validationMessages";

export const registerValidations = {
  email: {
    required: {
      value: true,
      message: validationMessages.isEmpty,
    },
    pattern: {
      type: "email",
      message: validationMessages.isEmail,
    },
  },
  password: {
    required: {
      value: true,
      message: validationMessages.isEmpty,
    },
  },
  firstname: {
    required: {
      value: true,
      message: validationMessages.isEmpty,
    },
  },
  lastname: {
    required: {
      value: true,
      message: validationMessages.isEmpty,
    },
  },
  companyname: {
    required: {
      value: true,
      message: validationMessages.isEmpty,
    },
  },
  website: {
    required: {
      value: true,
      message: validationMessages.isEmpty,
    },
  },
};
