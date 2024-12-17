import { useState } from "react";
import "react-notifications/lib/notifications.css";
import { useDispatch } from "react-redux";
import {
  loginUserWithId,
  registerUser,
  updateIsLoggedIn,
} from "@/redux/reducers/authReducer";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";
import Image from "next/image";
import Input from "@/components/ui/Input";
import validationMessages from "@/utils/validations/validationMessages";
import {
  validateForm,
  validateFormField,
} from "@/utils/validations/validationLogic";
import { loginValidations } from "./LoginValidations";
import validationUtils from "@/utils/validations/validationUtils";
import Button from "@/components/ui/Button";
import {
  hidePopup,
  showPopup,
  showToaster,
} from "@/redux/reducers/commonReducer";
import RegisterForm from "../register/RegisterForm";
import ForgotPasswordForm from "../forgotpassword/ForgotPasswordForm";
import { useRouter } from "next/navigation";
import { loginUser, verifyAppSumoCode } from "@/utils";
import { fetchUserSubscription } from "@/redux/reducers/userSubscriptionReducer";
import { setShowBanner } from "@/redux/reducers/dealsReducer";
// import Input from "@/components/ui/Input";
// import Checkbox from "@/components/ui/Checkbox";

const LoginForm = ({ origin, code }) => {
  const [vals, setValue] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const login = async () => {
    setErrors({});
    const formErrors = validateForm(vals, loginValidations);
    setErrors(formErrors);

    if (
      Object.keys(errors).length === 0 &&
      Object.keys(formErrors).length === 0
    ) {
      try {
        setLoading(true);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          vals?.email,
          vals?.password
        );
        const user = userCredential.user;
        // localStorage.setItem("userId", user.uid);
        // await sendEmailVerification(user, {
        //   url: "http://localhost:3000/login",
        // });

        // if (!user.emailVerified) {
        //   await sendEmailVerification(user);

        //   NotificationManager.success(
        //     "Please check your email to verify your account.",
        //     "",
        //     3000
        //   );
        // }
        // dispatch(
        //   loginUserWithId({
        //     id: user.uid,
        //   })
        // );
        // dispatch(hidePopup());

        dispatch(
          showToaster({
            variant: "success",
            title: "Successfully signed in",
            description: "",
          })
        );
        dispatch(hidePopup());
        dispatch(updateIsLoggedIn(true));

        let loginData;

        if (code && origin && code != "null") {
          loginData = await loginUser(user.uid, code);
          dispatch(fetchUserSubscription(user.uid));
        } else {
          loginData = await loginUser(user.uid);
        }

        if (loginData?.status === "success") {
          const firstname = loginData?.user?.firstname;
          const lastname = loginData?.user?.lastname;
          const username = `${firstname} ${lastname}`;

          if (username !== user.displayName) {
            await updateProfile(user, {
              displayName: username,
            });
          }
        }
        if (loginData?.status === "success" && loginData?.user?.login_count) {
          localStorage.setItem(
            "login_count",
            loginData.user.login_count.toString()
          );
          dispatch(setShowBanner(true));
        }

        if (
          loginData?.status === "success" &&
          loginData?.user?.preferences == false
        ) {
          router.push("/onboarding");
        } else if (origin === "AppSumo") {
          router.push("/");
        }
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error:", error.code);
        if (
          error.code == "auth/invalid-credential" ||
          error.code == "auth/invalid-email"
        ) {
          dispatch(
            showToaster({
              variant: "error",
              title: "Please enter valid credentials",
              description: "",
            })
          );
          // dispatch(hidePopup());
        } else {
          dispatch(
            showToaster({
              variant: "error",
              title: errorMessage,
              description: "",
            })
          );
          // dispatch(hidePopup());
        }
      } finally {
        setLoading(false);
      }
    }
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
      loginValidations &&
      validateFormField(
        fieldName,
        fieldValue,
        loginValidations[fieldName],
        vals
      );
    updateFormErrors(fieldName, fieldError);
  };

  return (
    <div className="text-left">
      <div className="mx-auto z-10 flex justify-center md:h-fit px-4  bg-white md:pt-9 rounded-lg">
        <div className="flex justify-center flex-1 py-6 md:pb-12">
          <div className="px-2 md:px-8">
            <div className="">
              <h2 className="text-2xl md:text-[36px] font-semibold  text-gray-800">
                Sign in
              </h2>
              <p className="flex gap-1 text-sm text-gray-700 pb-2 md:pb-6 mt-3">
                New user?{" "}
                <div
                  onClick={() => {
                    if (origin === "AppSumo") {
                      router.push(`/partner-appsumo-register?code=${code}`);
                    } else {
                      dispatch(
                        showPopup({
                          title: "",
                          description: <RegisterForm />,
                          btnArray: [],
                          classAdditions: {
                            popupContainer: "w-11/12 md:w-2/5",
                          },
                        })
                      );
                    }
                  }}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  Sign up for free
                </div>
              </p>
            </div>

            <div className="block space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Login or Email"
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
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  variant="border"
                  name="password"
                  val={vals.password}
                  error={errors.password}
                  onBlur={handleBlur}
                  inputStyle={`${
                    errors.password &&
                    "!border !border-[#9e1c1c] !bg-[#fcf8f8] "
                  }`}
                />
              </div>
              <div className="flex items-center justify-between cursor-pointer">
                <label className="flex items-center cursor-pointer">
                  {/* <Checkbox
                      name=""
                      label={checkbox.label}
                      className={className}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={checkbox.label}
                    /> */}
                  <span className="text-sm pl-3 text-gray-700">
                    Remember me
                  </span>
                </label>
                <span
                  className="text-sm text-[#3A4363]"
                  onClick={() => {
                    dispatch(
                      showPopup({
                        title: "",
                        description: <ForgotPasswordForm />,
                        btnArray: [],
                        classAdditions: {
                          popupContainer: "w-11/12 md:w-2/5",
                        },
                      })
                    );
                  }}
                >
                  Forgot your password?
                </span>
              </div>
              <Button
                variant="primary"
                size="large"
                className={`w-full  hover:brightness-75 transition-all duration-200 ease-in-out ${
                  loading ? "cursor-not-allowed" : ""
                } !bg-darkMutedPurple`}
                onClick={() => login()}
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
              <span className="block px-3 my-6 text-sm text-center text-gray-600 bg-white">
                <span className="block w-full bg-white border-b border-gray-200">
                  &nbsp;
                </span>
                <span className="relative z-20 px-20 py-4 bg-white -top-3">
                  or
                </span>
              </span>
              <div className="block md:flex md:justify-between">
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

export default LoginForm;
