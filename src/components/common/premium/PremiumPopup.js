import Button from "@/components/ui/Button";
import {
  hidePopup,
  showPopup,
  showToaster,
} from "@/redux/reducers/commonReducer";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { useClientMediaQuery } from "@/features/hooks";
import axios from "axios";
import { useState } from "react";
import BindFeaturesList from "../BindFeaturesList";
import moment from "moment";
import { fetchUserSubscription } from "@/redux/reducers/userSubscriptionReducer";
import LoginForm from "../login/LoginForm";
import { PremiumPopupSkeleton } from "@/components/ui/LoadingSkeleton";
import CodeGeneratorFeaturesList from "../CodeGeneratorFeaturesList";

const PremiumPopup = ({ isCodeGenerator = false, isConnectCarbon = false }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userSubscription = useSelector((state) => state.userSubscription);

  const isMobile = useClientMediaQuery("(max-width: 600px)");
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async (plan) => {
    if (!currentUser?.uid) {
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
      return;
    }

    let apiEndpoint;

    if (buttonLabel === "Renew") {
      apiEndpoint = process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/checkout";
    } else {
      apiEndpoint = process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/checkout";
    }

    const formData = new FormData();
    formData.append("plan", "monthly");

    if (currentUser?.uid) {
      formData.append("user_id", currentUser.uid);
    }

    // if (buttonLabel !== "Renew") {
    // const currentUrl = window.location.href;
    // formData.append("success_url", `${currentUrl}?paymentSuccess=true`);
    // formData.append("cancel_url", `${currentUrl}?paymentFailed=true`);
    // }

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);

    url.search = "";

    const successUrl = `${url.href}?paymentSuccess=true`;
    const cancelUrl = `${url.href}?paymentFailed=true`;

    formData.append("success_url", successUrl);
    formData.append("cancel_url", cancelUrl);

    try {
      setIsLoading(true);
      const response = await axios.post(apiEndpoint, formData);

      if (buttonLabel === "Renew") {
        if (response?.data?.status == "error") {
          dispatch(
            showToaster({
              variant: "error",
              title: "Something went wrong. Please try again after some time",
              description: "",
            })
          );
        } else {
          // dispatch(fetchUserSubscription(currentUser.uid));
          // dispatch(
          //   showToaster({
          //     variant: "success",
          //     title: "Your subscription has been renewed successfully.",
          //     description: "",
          //   })
          // );

          // dispatch(hidePopup());
          window.location.href = response.data.url;
        }
      } else {
        if (response?.data?.status === "success") {
          window.location.href = response.data.url;
        } else {
          dispatch(
            showToaster({
              variant: "error",
              title: "Something went wrong. Please try again after some time.",
              description: "",
            })
          );
        }
      }
    } catch (error) {
      console.log("Error during payment:", error);
      dispatch(
        showToaster({
          variant: "error",
          title: "Something went wrong. Please try again after some time.",
          description: "",
        })
      );
      if (buttonLabel === "Renew") {
        dispatch(hidePopup());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonLabelAndPlan = () => {
    if (userSubscription) {
      const user_info = userSubscription?.user_info;
      const subscriptionPlan = user_info?.subscription_plan;
      const subscriptionType = user_info?.subscription_type;
      const subscriptionStatus = user_info?.subscription_status;
      const subscriptionEndDate = user_info?.subscription_end_date;
      const daysLeft = moment(subscriptionEndDate).diff(moment(), "days");

      if (subscriptionPlan == "" && subscriptionType == "Free") {
        if (subscriptionStatus == "canceled") {
          return {
            buttonLabel: "Renew",
            plan: "monthly",
          };
        } else {
          return {
            buttonLabel: "Start a 7 day trial",
            plan: "trial",
          };
        }
      } else if (subscriptionPlan == "trial") {
        if (daysLeft > 0 && subscriptionStatus === "active") {
          return {
            buttonLabel: `Start monthly subscription`,
            plan: "monthly",
          };
        } else {
          return {
            buttonLabel: "Renew",
            plan: "monthly",
          };
        }
      } else if (subscriptionPlan == "monthly") {
        if (daysLeft <= 0) {
          return {
            buttonLabel: "Renew",
            plan: "monthly",
          };
        } else {
          return {
            buttonLabel: "",
            plan: "monthly",
          };
        }
      }
    }

    return {
      buttonLabel: "Start a 7 day trial",
      plan: "trial",
    };
  };

  const { buttonLabel, plan } = getButtonLabelAndPlan();

  return userSubscription.loading ? (
    <PremiumPopupSkeleton />
  ) : (
    <div className="md:p-10">
      <div className="flex justify-end p-3 md:p-0 md:absolute md:right-5 md:top-5">
        <Image
          src="/images/cross.png"
          alt="close"
          width={24}
          height={24}
          className="block cursor-pointer"
          onClick={() => dispatch(hidePopup())}
        />
      </div>

      <div
        className={`${
          isMobile && "fixed top-1/2 transform -translate-y-1/2"
        } p-5 md:p-0 md:static md:mt-5`}
      >
        <h1 className="text-primary font-semibold text-[24px]  ml-3">
          {isCodeGenerator
            ? "Get full access to Bind AI Code Generator"
            : "Try Bind Premium"}
        </h1>
        <div className="md:mt-7 mt-10 ml-3">
          {isCodeGenerator ? (
            <CodeGeneratorFeaturesList />
          ) : (
            <BindFeaturesList isConnectCarbon={isConnectCarbon} />
          )}
        </div>

        <div className="md:mt-9 mt-[20%] flex flex-col md:gap-2 gap-3 ">
          {buttonLabel && (
            <Button
              variant="primary"
              size="large"
              className={"w-full !rounded-lg"}
              onClick={() => {
                if (userSubscription?.sumo_data) {
                  window.open(
                    `${"https://appsumo.com/account/products/"}`,
                    "_blank"
                  );
                } else {
                  handlePayment(plan);
                }
              }}
              loading={isLoading}
            >
              {isLoading ? (
                <p className="font-medium text-[16px] text-white">Loading...</p>
              ) : (
                <p className="font-medium text-[16px] text-white">
                  {userSubscription?.sumo_data
                    ? "Upgrade to Next Tier"
                    : userSubscription?.user_info?.trial_available === false ||
                      userSubscription?.user_info?.trial_available === "false"
                    ? "Subscribe Now"
                    : buttonLabel == "Renew"
                    ? (userSubscription?.user_info?.subscription_status ===
                        "canceled" &&
                        userSubscription?.user_info?.subscription_plan === "" &&
                        userSubscription?.user_info?.subscription_type ===
                          "Free") ||
                      (userSubscription?.user_info?.subscription_plan ===
                        "trial" &&
                        moment(
                          userSubscription?.user_info?.subscription_end_date
                        ).diff(moment(), "days") <= 0)
                      ? "Subscribe Now"
                      : "Renew subscription"
                    : buttonLabel}
                </p>
              )}
            </Button>
          )}
          <p className="text-sm font-normal text-primary self-center">
            <span className="font-semibold">$18</span>/month after trial ends
          </p>
        </div>
        {/* <p className="text-[12px] font-normal text-[#848A9E] md:mt-5 mt-7 ml-2">
          *30 uses per day for Advanced Models such as Claude Opus, GPT-4.
          Limits refreshed daily.
        </p> */}
      </div>
    </div>
  );
};

export default PremiumPopup;
