import validationMessages from "@/utils/validations/validationMessages";

export const loginValidations = {
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
    }
  },
};
