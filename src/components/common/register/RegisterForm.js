import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loginUserWithId,
  registerUser,
  updateIsLoggedIn,
} from "@/redux/reducers/authReducer";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  validateForm,
  validateFormField,
} from "@/utils/validations/validationLogic";
import { registerValidations } from "./RegisterValidations";
import validationutils from "@/utils/validations/validationUtils";
import LoginForm from "../login/LoginForm";
import {
  hidePopup,
  showPopup,
  showToaster,
} from "@/redux/reducers/commonReducer";
import { fetchUserSubscription } from "@/redux/reducers/userSubscriptionReducer";
import { useRouter } from "next/navigation";
import { loginUser, verifyAppSumoCode } from "@/utils";
import { setShowBanner } from "@/redux/reducers/dealsReducer";

const RegisterForm = ({ origin, code }) => {
  const [vals, setValue] = useState({
    email: "",
    password: "",
    companyname: "",
    website: "",
    firstname: "",
    lastname: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    companyname: "",
    website: "",
    firstname: "",
    lastname: "",
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const createAccount = async () => {
    setErrors({});
    const formErrors = validateForm(vals, registerValidations);
    setErrors(formErrors);

    if (
      Object.keys(errors).length === 0 &&
      Object.keys(formErrors).length === 0
    ) {
      const newAccount = {
        firstname: vals?.firstname,
        lastname: vals?.lastname,
        email: vals?.email,
        password: vals?.password,
        companyname: vals?.companyname,
        website: vals?.website,
      };

      try {
        setLoading(true);

        if (code && origin === "AppSumo" && code != "null") {
          const verifyCode = await verifyAppSumoCode(code);
          if (!verifyCode) {
            dispatch(
              showToaster({
                variant: "error",
                title: "Your AppSumo redirect link is invalid.",
                description: "",
              })
            );
            return;
          }
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          vals?.email,
          vals?.password
        );
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${vals?.firstname} ${vals?.lastname}`,
          photoURL: "",
        });

        await sendEmailVerification(user, {
          url: process.env.NEXT_PUBLIC_BASE_URL,
        });

        if (code && origin === "AppSumo" && code != "null") {
          newAccount.code = code;
        }

        await dispatch(
          registerUser({
            ...newAccount,
            userId: user.uid,
          })
        );

        dispatch(setShowBanner(true));

        dispatch(
          showToaster({
            variant: "success",
            title: "Welcome! You are successfully registered",
            description: "",
          })
        );
        // localStorage.setItem("user", email);
        localStorage.setItem("userId", user.uid);
        dispatch(hidePopup());
        dispatch(updateIsLoggedIn(true));
        router.push("/onboarding");
      } catch (error) {
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error:", errorMessage, error.errors);
        if (
          error.code === "auth/account-exists-with-different-credential" ||
          error.code === "auth/email-already-in-use"
        ) {
          dispatch(
            showToaster({
              variant: "error",
              title: "Email already registered using different provider",
              description: "",
            })
          );
        } else {
          dispatch(
            showToaster({
              variant: "error",
              title: errorMessage,
              description: "",
            })
          );
        }
        dispatch(hidePopup());
      } finally {
        setLoading(false);
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
    if (validationutils.isEmpty(fieldError)) {
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
      registerValidations &&
      validateFormField(
        fieldName,
        fieldValue,
        registerValidations[fieldName],
        vals
      );
    updateFormErrors(fieldName, fieldError);
  };

  const signInWithGoogle = async () => {
    try {
      if (code && origin === "AppSumo" && code != "null") {
        const verifyCode = await verifyAppSumoCode(code);
        if (!verifyCode) {
          dispatch(
            showToaster({
              variant: "error",
              title: "Your AppSumo redirect link is invalid.",
              description: "",
            })
          );
          return;
        }
      }

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential?.user;
      const isFirstLogin = getAdditionalUserInfo(userCredential).isNewUser;

      if (isFirstLogin) {
        const name = user.displayName.split(" ");
        const firstName = name[0];
        const lastName = name[1];
        const newAccount = {
          firstname: firstName,
          lastname: lastName,
          email: user.email,
          userId: user.uid,
        };

        if (code && origin && code != "null") {
          newAccount.code = code;
        }

        localStorage.setItem("userId", user.uid);
        dispatch(registerUser(newAccount));
        router.push("/onboarding");
      } else {
        let loginData;

        if (code && origin && code != "null") {
          loginData = await loginUser(user.uid, code);
          dispatch(fetchUserSubscription(user.uid));
        } else {
          loginData = await loginUser(user.uid);
        }

        if (loginData?.status === "success" && loginData?.user?.login_count) {
          localStorage.setItem(
            "login_count",
            loginData.user.login_count.toString()
          );
        }

        if (
          loginData?.status === "success" &&
          loginData?.user?.preferences == false
        ) {
          router.push("/onboarding");
        } else if (origin === "AppSumo") {
          router.push("/");
        }
      }

      dispatch(setShowBanner(true));
      // localStorage.setItem("userId", user.uid);
      dispatch(
        showToaster({
          variant: "success",
          title: "Successfully signed in with Google",
          description: "",
        })
      );
      dispatch(hidePopup());
      dispatch(updateIsLoggedIn(true));

      // history.navigate("/");
    } catch (error) {
      console.log("Error signing in with Google:", error.message);
      if (error.code === "auth/account-exists-with-different-credential") {
        dispatch(
          showToaster({
            variant: "error",
            title: "Email already registered using different provider",
            description: "",
          })
        );
      }
    }
    dispatch(hidePopup());
  };

  const signInWithGitHub = async () => {
    try {
      if (code && origin === "AppSumo" && code != "null") {
        const verifyCode = await verifyAppSumoCode(code);
        if (!verifyCode) {
          dispatch(
            showToaster({
              variant: "error",
              title: "Your AppSumo redirect link is invalid.",
              description: "",
            })
          );
          return;
        }
      }

      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const isFirstLogin = getAdditionalUserInfo(userCredential).isNewUser;

      if (isFirstLogin) {
        const name = user.displayName.split(" ");
        const firstName = name[0];
        const lastName = name[1];
        const newAccount = {
          firstname: firstName,
          lastname: lastName,
          email: user.email,
          userId: user.uid,
        };

        if (code && origin && code != "null") {
          newAccount.code = code;
        }

        dispatch(registerUser(newAccount));
        localStorage.setItem("userId", user.uid);
        router.push("/onboarding");
      } else {
        let loginData;

        if (code && origin && code != "null") {
          loginData = await loginUser(user.uid, code);
          dispatch(fetchUserSubscription(user.uid));
        } else {
          loginData = await loginUser(user.uid);
        }

        if (loginData?.status === "success" && loginData?.user?.login_count) {
          localStorage.setItem(
            "login_count",
            loginData.user.login_count.toString()
          );
        }

        if (
          loginData?.status === "success" &&
          loginData?.user?.preferences == false
        ) {
          router.push("/onboarding");
        } else if (origin === "AppSumo") {
          router.push("/");
        }
      }
      // localStorage.setItem("userId", user.uid);

      dispatch(setShowBanner(true));

      dispatch(
        showToaster({
          variant: "success",
          title: "Successfully signed in with Github",
          description: "",
        })
      );
      dispatch(hidePopup());
      dispatch(updateIsLoggedIn(true));

      // history.navigate("/");
    } catch (error) {
      console.log("Error signing in with GitHub:", error.message);
      if (error.code === "auth/account-exists-with-different-credential") {
        dispatch(
          showToaster({
            variant: "error",
            title: "Email already registered using different provider",
            description: "",
          })
        );
      }
    }
    dispatch(hidePopup());
  };
  return (
    <div className="text-left pt-4 md:pt-0">
      <div className="z-10 flex flex-col justify-center items-center  bg-white  md:py-4 px-2 md:px-8 mx-auto rounded-lg">
        <div className="flex flex-col max-[400px]:pt-10 justify-center flex-1 w-full">
          <div className="px-6">
            <div className="py-4  lg:pb-6">
              <h2 className="text-2xl md:text-[36px] font-semibold  text-gray-800">
                Create account
              </h2>
              <p className="flex gap-1 text-sm text-gray-700 mt-3">
                Already have an account?{" "}
                <div
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => {
                    if (origin === "AppSumo") {
                      router.push(`/partner-appsumo-login?code=${code}`);
                    } else {
                      dispatch(
                        showPopup({
                          title: "",
                          description: <LoginForm />,
                          btnArray: [],
                          classAdditions: {
                            popupContainer: "w-11/12 md:w-2/5",
                          },
                        })
                      );
                    }
                  }}
                >
                  Sign in here
                </div>
              </p>
            </div>

            <div className="block space-y-4">
              <Input
                type="email"
                placeholder="Email"
                onChange={handleChange}
                variant="border"
                name="email"
                value={vals.email}
                error={errors.email}
                onBlur={handleBlur}
                inputStyle={`${
                  errors.email && "!border !border-[#9e1c1c] !bg-[#fcf8f8] "
                }`}
              />
              <Input
                type="password"
                placeholder="Password"
                onChange={handleChange}
                variant="border"
                name="password"
                value={vals.password}
                error={errors.password}
                onBlur={handleBlur}
                inputStyle={`${
                  errors.password && "!border !border-[#9e1c1c] !bg-[#fcf8f8] "
                }`}
              />
              {/* <span className="block font-semibold tracking-wider  text-gray-600 uppercase text-xs mt-2">
            Minimal 8 characters
          </span> */}

              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  placeholder="First Name"
                  onChange={handleChange}
                  variant="border"
                  name="firstname"
                  value={vals.firstname}
                  error={errors.firstname}
                  onBlur={handleBlur}
                  inputStyle={`${
                    errors.firstname &&
                    "!border !border-[#9e1c1c] !bg-[#fcf8f8] "
                  }`}
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  onChange={handleChange}
                  variant="border"
                  name="lastname"
                  value={vals.lastname}
                  error={errors.lastname}
                  onBlur={handleBlur}
                  inputStyle={`${
                    errors.lastname &&
                    "!border !border-[#9e1c1c] !bg-[#fcf8f8] "
                  }`}
                />
              </div>
              <Input
                type="text"
                placeholder="Your company name"
                onChange={handleChange}
                variant="border"
                name="companyname"
                value={vals.companyname}
                error={errors.companyname}
                onBlur={handleBlur}
                inputStyle={`${
                  errors.companyname &&
                  "!border !border-[#9e1c1c] !bg-[#fcf8f8] "
                }`}
              />
              <Input
                type="text"
                placeholder="Company website"
                onChange={handleChange}
                variant="border"
                name="website"
                value={vals.website}
                error={errors.website}
                onBlur={handleBlur}
                inputStyle={`${
                  errors.website && "!border !border-[#9e1c1c] !bg-[#fcf8f8] "
                }`}
              />
              <Button
                variant="primary"
                size="large"
                className={`w-full  hover:brightness-75 transition-all duration-200 ease-in-out ${
                  loading ? "cursor-not-allowed" : ""
                } !bg-darkMutedPurple`}
                onClick={() => createAccount()}
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign up"}
              </Button>
              <span className="block px-3 my-6 text-sm text-center text-gray-600 bg-white">
                <span className="block w-full bg-white border-b border-gray-200">
                  &nbsp;
                </span>
                <span className="relative z-20 px-20 py-4 bg-white -top-3">
                  or
                </span>
              </span>
              <div className="block md:flex justify-between">
                <Button
                  variant="secondary"
                  iconAltText="google"
                  size="large"
                  icon="/svgs/google.svg"
                  onClick={() => signInWithGoogle()}
                  className={"w-full"}
                >
                  Sign in with Google
                </Button>
                <Button
                  variant="secondary"
                  iconAltText="github"
                  size="large"
                  icon="/svgs/github.svg"
                  onClick={() => signInWithGitHub()}
                  className={"w-full mt-2 md:mt-0"}
                >
                  Sign in with Github
                </Button>
              </div>
              <div className="text-xs text-gray-700 w-11/12 md:w-2/3 mx-auto text-center pb-12">
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

export default RegisterForm;
