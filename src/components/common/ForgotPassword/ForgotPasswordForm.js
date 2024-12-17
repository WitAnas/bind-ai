import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  validateForm,
  validateFormField,
} from "@/utils/validations/validationLogic";
import { forgotPasswordValidations } from "./ForgotPasswordValidations";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { hidePopup, showToaster } from "@/redux/reducers/commonReducer";
import { useDispatch } from "react-redux";
import { auth } from "@/config/FirebaseConfig";
import validationUtils from "@/utils/validations/validationUtils";

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const [vals, setValue] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    setErrors({});
    const formErrors = validateForm(vals, forgotPasswordValidations);
    setErrors(formErrors);

    if (
      Object.keys(errors).length === 0 &&
      Object.keys(formErrors).length === 0
    ) {
      try {
        setIsLoading(true);
        await sendPasswordResetEmail(auth, vals?.email);

        setValue({
          email: "",
        });

        dispatch(
          showToaster({
            variant: "success",
            title: "Password reset link has been sent to your email address.",
            description: "",
          })
        );

        dispatch(hidePopup());
      } catch (err) {
        console.log("Error sending password reset email:", err);
        dispatch(
          showToaster({
            variant: "error",
            title: "An error occurred. Please try again later",
            description: "",
          })
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getFieldData = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldName = name;
    // const fieldValue = type === "checkbox" ? checked : value;
    const fieldValue = value;
    return { fieldName, fieldValue, type, checked };
  };

  const handleChange = (event) => {
    setValue({
      ...vals,
      [event.target.name]: event.target.value,
    });
  };

  const updateFormErrors = (fieldName, fieldError) => {
    if (validationUtils.isEmpty(fieldError)) {
      const updatedErrors = { ...errors };
      delete updatedErrors[fieldName];
      setErrors(updatedErrors);
    } else {
      setErrors({ ...errors, ...fieldError });
    }
  };

  const handleBlur = (event) => {
    event.preventDefault();
    if (event.relatedTarget && event.relatedTarget.type === "submit") {
      return; // prevent field level validation on submit click
    }
    const { fieldName, fieldValue } = getFieldData(event);
    // updateTouched(fieldName);
    const fieldError =
      forgotPasswordValidations &&
      validateFormField(
        fieldName,
        fieldValue,
        forgotPasswordValidations[fieldName],
        vals
      );
    updateFormErrors(fieldName, fieldError);
  };

  return (
    <div className="text-left">
      <div className="mx-auto z-10 flex flex-col justify-center md:h-fit px-4  bg-white pt-6 md:pt-12 rounded-lg">
        <div className="flex flex-col justify-center flex-1 pb-12">
          <div className="px-2 md:px-8">
            <div className="space-y-1 pb-2 lg:pb-6">
              <h2 className="text-2xl md:text-[36px] font-semibold  text-gray-800">
                Forgot Password
              </h2>
            </div>

            <div className="block space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Please Enter Your Email"
                  onChange={handleChange}
                  variant="border"
                  name="email"
                  value={vals.email}
                  error={errors.email}
                  onBlur={handleBlur}
                />
              </div>

              <Button
                variant="primary"
                size="large"
                className="w-full"
                onClick={() => handleSubmit()}
              >
                {isLoading ? (
                  <span className="mr-2">Sending...</span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="text-xs text-gray-700 w-11/12 md:w-2/3 mx-auto text-center pt-3">
                You acknowledge that you read, and agree to our{" "}
                <a href="" className="font-semibold underline">
                  Terms of Service{" "}
                </a>{" "}
                and our{" "}
                <a href="" className="font-semibold underline">
                  Privacy Policy.{" "}
                </a>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
