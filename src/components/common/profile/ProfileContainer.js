import Button from "@/components/ui/Button";
import moment from "moment";
import {
  hidePopup,
  showPopup,
  showToaster,
} from "@/redux/reducers/commonReducer";
import { handleLogout } from "@/utils";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import CancelSubPopup from "../premium/CancelSubPopup";
import BindFeaturesList from "../BindFeaturesList";
import axios from "axios";
import {
  clearUserSubscription,
  fetchUserSubscription,
} from "@/redux/reducers/userSubscriptionReducer";
import {
  getUserSubscriptionState,
  hasActivePremiumSubscription,
} from "@/utils/subscription";
import { useEffect, useState } from "react";
import { ProfileSkeleton } from "@/components/ui/LoadingSkeleton";

const ProfileContainer = ({ userName }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userSubscription = useSelector((state) => state.userSubscription);
  const [subsState, setSubsState] = useState(
    getUserSubscriptionState(userSubscription)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    setSubsState(getUserSubscriptionState(userSubscription));
  }, [userSubscription]);

  const handlePayment = async (plan) => {
    let apiEndpoint;

    if (subsState == "renew") {
      apiEndpoint = process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/checkout";
    } else {
      apiEndpoint = process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/checkout";
    }

    const formData = new FormData();
    formData.append("plan", "monthly");

    if (currentUser?.uid) {
      formData.append("user_id", currentUser.uid);
    }

    // if (subsState != "renew") {
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
      const response = await axios.post(apiEndpoint, formData);

      if (subsState == "renew") {
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
          window.location.href = response.data.url;
        }
      } else {
        if (response?.data?.status == "success") {
          window.location.href = response.data.url;
        } else {
          dispatch(
            showToaster({
              variant: "error",
              title: "Something went wrong. Please try again after some time",
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
    }
  };

  return userSubscription.loading ? (
    <ProfileSkeleton />
  ) : (
    <div className="px-6 py-6">
      <div className="flex justify-between">
        <h1 className="text-[16px] font-[550]">My profile</h1>
        <Image
          src="/images/cross.png"
          alt="close"
          width={24}
          height={24}
          className="block cursor-pointer"
          onClick={() => dispatch(hidePopup())}
        />
      </div>
      <div className="border border-[#F1F2F5] flex items-center rounded-xl mt-6">
        <div className="p-[13px] rounded-lg bg-[#F0F5FC] ml-2 my-2">
          <Image
            src="/images/profile.png"
            alt="profile"
            width={18.75}
            height={18.75}
          />
        </div>
        <div className="flex flex-col">
          <span className="pl-3 font-medium">{userName}</span>
          <span className="pl-3 font-medium">{currentUser?.email}</span>
        </div>
      </div>
      <div className="border border-[#F1F2F5] rounded-xl my-2 py-2 px-2">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center">
            <Image
              src="/images/subscription.png"
              alt="subscription"
              width={45}
              height={45}
              className="block"
            />
            <span className="ml-3 font-medium">Subscription Tier</span>
          </div>
          <p
            className={`text-sm font-semibold py-[6px] px-3 bg-[#E4E5EA] rounded-3xl ${
              (subsState === "premium" ||
                hasActivePremiumSubscription(userSubscription) ||
                (userSubscription?.sumo_data &&
                  userSubscription?.sumo_data?.tier)) &&
              "bg-[#e1ddfe] text-secondary"
            } flex gap-1 items-center justify-center`}
          >
            {(subsState === "premium" ||
              hasActivePremiumSubscription(userSubscription) ||
              (userSubscription?.sumo_data &&
                userSubscription?.sumo_data?.tier)) && (
              <Image
                src={`/images/premium1.png`}
                alt="premium"
                width={14}
                height={14}
                className="mr-1"
              />
            )}
            <span>
              {userSubscription?.sumo_data && userSubscription?.sumo_data?.tier
                ? ` Tier ${userSubscription?.sumo_data?.tier}`
                : subsState === "premium" ||
                  hasActivePremiumSubscription(userSubscription)
                ? userSubscription?.user_info?.subscription_plan ==
                  process.env.NEXT_PUBLIC_ANNUAL_SCALE_PLAN
                  ? "Scale"
                  : "Premium"
                : subsState === "trialActive"
                ? "Trial"
                : "Free"}
            </span>
          </p>
        </div>

        <div className="px-2 mb-5">
          <p className="text-sm font-[500] text-secondary mt-[14px]">
            {userSubscription?.sumo_data && userSubscription.sumo_data?.tier
              ? `You have Tier ${userSubscription.sumo_data?.tier} access via AppSumo`
              : subsState === "premium" || subsState === "trialActive"
              ? `You have ${
                  userSubscription?.user_info?.subscription_plan ==
                  process.env.NEXT_PUBLIC_ANNUAL_SCALE_PLAN
                    ? "scale"
                    : "premium"
                }  access`
              : "Try our Premium features!"}
          </p>
          <p className="mt-2 text-sm font-normal text-label mb-[14px]">
            {subsState === "premium" || subsState === "trialActive"
              ? "Thank you for using Bind!"
              : "Unlock exclusive features by upgrading to premium for a tailored experience."}
          </p>
          {userSubscription?.sumo_data && userSubscription.sumo_data?.tier ? (
            <div>
              <p className="font-[500] text-sm text-primary">
                Your License Status
              </p>
              <p className="font-normal text-sm text-primary">
                {userSubscription?.sumo_data?.license_status}
              </p>
            </div>
          ) : subsState === "premium" ? (
            userSubscription?.user_info?.subscription_status === "canceled" ? (
              <div>
                <p className="font-[500] text-sm text-primary">
                  Your subscription was cancelled on
                </p>
                <p className="font-normal text-sm text-primary">
                  {moment(
                    userSubscription?.user_info?.subscription_cancel_date
                  ).format("MMMM DD, YYYY")}
                </p>
                <p className="font-[500] text-sm text-primary mt-2">
                  you still have access until
                </p>
                <p className="font-normal text-sm text-primary">
                  {moment(
                    userSubscription?.user_info?.subscription_end_date
                  ).format("MMMM DD, YYYY")}
                </p>
              </div>
            ) : (
              <div className="mt-6">
                <div>
                  <p className="font-[500] text-sm text-primary">
                    {userSubscription?.user_info?.subscription_plan ===
                    "monthly"
                      ? "Monthly Subscription renews on"
                      : "Yearly Subscription renews on"}
                  </p>
                  <p className="font-normal text-sm text-primary">
                    {moment(
                      userSubscription?.user_info?.subscription_end_date
                    ).format("MMMM DD, YYYY")}
                  </p>
                </div>
                <p
                  className="flex font-normal text-sm text-[#848A9E] mt-4 underline"
                  onClick={() => {
                    dispatch(
                      showPopup({
                        title: "",
                        description: (
                          <CancelSubPopup cancelSubsState="premium" />
                        ),
                        btnArray: [],
                        classAdditions: {
                          popupContainer: "md:w-[30%] w-11/12",
                        },
                      })
                    );
                  }}
                >
                  Manage Subscription
                </p>
              </div>
            )
          ) : subsState === "trialActive" ? (
            <div className="mt-6">
              <div>
                <p className="font-[500] text-sm text-primary">
                  Your trial will end on
                </p>
                <p className="font-normal text-sm text-primary">
                  {moment(
                    userSubscription?.user_info?.subscription_end_date
                  ).format("MMMM DD, YYYY")}
                </p>
              </div>
              <p
                className="flex font-normal text-sm text-[#848A9E] mt-4 underline"
                onClick={() => {
                  dispatch(
                    showPopup({
                      title: "",
                      description: <CancelSubPopup cancelSubsState="trial" />,
                      btnArray: [],
                      classAdditions: {
                        popupContainer: "md:w-[30%] w-11/12",
                      },
                    })
                  );
                }}
              >
                Manage Trial
              </p>
            </div>
          ) : (
            <BindFeaturesList />
          )}
        </div>
        {subsState !== "premium" && subsState !== "trialActive" ? (
          <>
            <Button
              variant="secondary"
              size="large"
              className={"w-full text-secondary !bg-[#E1DDFE] !rounded-lg"}
              onClick={() => {
                let plan;
                if (subsState == "free") {
                  plan = "trial";
                } else if (
                  subsState === "trialActive"
                  // ||
                  // subsState === "trialEnded"
                ) {
                  plan = "monthly";
                } else if (subsState === "renew") {
                  plan = "monthly";
                }

                handlePayment(plan);
              }}
            >
              <p className="font-medium text-[16px]">
                {subsState == "free"
                  ? userSubscription?.user_info?.trial_available === false ||
                    userSubscription?.user_info?.trial_available === "false"
                    ? "Subscribe Now"
                    : "Start a 7 day trial"
                  : ""}
                {/* {(subsState == "trialActive" || subsState == "trialEnded") &&
                  "Start monthly subscription"} */}
                {subsState === "renew" &&
                  ((userSubscription?.user_info?.subscription_status ===
                    "canceled" &&
                    userSubscription?.user_info?.subscription_plan === "" &&
                    userSubscription?.user_info?.subscription_type ===
                      "Free") ||
                  (userSubscription?.user_info?.subscription_plan === "trial" &&
                    moment(
                      userSubscription?.user_info?.subscription_end_date
                    ).diff(moment(), "days") <= 0)
                    ? "Subscribe Now"
                    : "Renew subscription")}
              </p>
            </Button>
            <p
              className="text-center flex justify-center font-normal text-sm text-[#848A9E] mt-4 underline"
              onClick={() => {
                window.open(
                  `${
                    process.env.NEXT_PUBLIC_BIND_BASE_LINK ||
                    "https://www.getbind.co"
                  }/contact`,
                  "_blank" || "_self"
                );
              }}
            >
              Need Private Instance of Bind? Request Enterprise plan
            </p>
          </>
        ) : (
          <></>
        )}
      </div>
      <div
        className="border border-[#F1F2F5] flex items-center justify-between rounded-xl py-2 pl-2 cursor-pointer"
        onClick={() => {
          handleLogout();
          dispatch(hidePopup());
          dispatch(clearUserSubscription());
        }}
      >
        <div className="flex items-center">
          <Image
            src="/images/logout-btn.png"
            alt="logout"
            width={45}
            height={45}
            className="block pr-3"
          />
          <span className="font-medium">Log out</span>
        </div>
        <Image
          src="/images/right-arrow.png"
          alt="close"
          width={16}
          height={16}
          className="mr-4"
        />
      </div>
    </div>
  );
};

export default ProfileContainer;
