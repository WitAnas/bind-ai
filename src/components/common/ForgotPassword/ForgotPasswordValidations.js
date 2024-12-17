import validationMessages from "@/utils/validations/validationMessages";

export const forgotPasswordValidations = {
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
};
