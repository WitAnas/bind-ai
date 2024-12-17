import { useState } from "react";
import "react-notifications/lib/notifications.css";
import { useDispatch, useSelector } from "react-redux";
import Input from "@/components/ui/Input";
import {
  validateForm,
  validateFormField,
} from "@/utils/validations/validationLogic";
import { companyFormValidations } from "./CompanyFormValidations";
import validationUtils from "@/utils/validations/validationUtils";
import Button from "@/components/ui/Button";
import axios from "axios";
import { hidePopup, showToaster } from "@/redux/reducers/commonReducer";
// import Input from "@/components/ui/Input";
// import Checkbox from "@/components/ui/Checkbox";

const CompanyForm = () => {
  const [vals, setValue] = useState({
    companyName: "",
    website: "",
    employeeCount: "",
  });
  const [errors, setErrors] = useState({
    companyName: "",
    website: "",
    employeeCount: "",
  });

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  const createCompany = async () => {
    setErrors({});
    const formErrors = validateForm(vals, companyFormValidations);
    setErrors(formErrors);

    if (
      Object.keys(errors).length === 0 &&
      Object.keys(formErrors).length === 0
    ) {
      const apiEndpoint = process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/reg_comp";
      const formData = new FormData();
      currentUser?.uid && formData.append("user_id", currentUser.uid);
      formData.append("name_of_company", vals.companyName);
      formData.append("website", vals.website);
      formData.append("number_of_employees", parseInt(vals?.employeeCount));
      try {
        const response = await axios.post(apiEndpoint, formData);
        console.log("this is company creating response", response?.data);
        if (response?.data?.status === "success") {
          // window.location.href = response.data.url;
          dispatch(
            showToaster({
              variant: "success",
              title: "Company created successfully",
              description: "",
            })
          );
          dispatch(hidePopup());
        } else {
          dispatch(
            showToaster({
              variant: "error",
              title: "Something went wrong. Please try again after some time.",
              description: "",
            })
          );
        }
      } catch (error) {
        console.log("error in creating company", error);
        dispatch(
          showToaster({
            variant: "error",
            title: "Something went wrong. Please try again after some time.",
            description: "",
          })
        );
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
      companyFormValidations &&
      validateFormField(
        fieldName,
        fieldValue,
        companyFormValidations[fieldName],
        vals
      );
    updateFormErrors(fieldName, fieldError);
  };

  return (
    <div className="text-left">
      <div className="mx-auto z-10 flex justify-center md:h-fit px-4  bg-white md:pt-12 rounded-lg">
        <div className="flex justify-center flex-1 py-6 md:pb-12">
          <div className="px-2 md:px-8">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-[36px] font-semibold  text-gray-800 mb-4">
                Create Company
              </h2>
              {/* <p className="flex gap-1 text-sm text-gray-700 pb-2 md:pb-6">
                New user?{" "}
                <div
                  onClick={() => {
                    dispatch(
                      showPopup(
                        {
                          title: "",
                          description: <RegisterForm />,
                          btnArray: [],
                          classAdditions:  {
                            popupContainer: "w-11/12 md:w-2/5",
                          }
                        }  
                      )
                    );
                  }}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  Sign up for free
                </div>
              </p> */}
            </div>

            <div className="block space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Name of company"
                  onChange={handleChange}
                  variant="border"
                  name="companyName"
                  value={vals.companyName}
                  error={errors.companyName}
                  onBlur={handleBlur}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Website"
                  onChange={handleChange}
                  variant="border"
                  name="website"
                  val={vals.website}
                  error={errors.website}
                  onBlur={handleBlur}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Number of employees"
                  onChange={handleChange}
                  variant="border"
                  name="employeeCount"
                  val={vals.employeeCount}
                  error={errors.employeeCount}
                  onBlur={handleBlur}
                />
              </div>

              <Button
                variant="primary"
                size="large"
                className="w-full"
                onClick={() => createCompany()}
              >
                Create Company
              </Button>
              <div className="text-xs text-gray-700 w-11/12 mx-auto text-center pt-3">
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

export default CompanyForm;
