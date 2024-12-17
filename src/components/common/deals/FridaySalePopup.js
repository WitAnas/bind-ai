import React, { useState } from "react";
import { HiCheckCircle } from "react-icons/hi";
import Button from "@/components/ui/Button";
import { MdOutlineClose } from "react-icons/md";
import { useClientMediaQuery } from "@/features/hooks";
import {
  hidePopup,
  showPopup,
  showToaster,
} from "@/redux/reducers/commonReducer";
import { useDispatch, useSelector } from "react-redux";
import CountdownTimer from "./CountdownTimer";
import LoginForm from "../login/LoginForm";
import axios from "axios";

const InfoItem = ({
  text,
  Icon,
  iconWidth = 20,
  iconHeight = 20,
  iconClassName = "w-5 h-5 text-[#9e9e9e]",
  textClassName = "text-sm font-[Inter,sans-serif] font-normal dark:text-white text-[#131314]",
}) => {
  return (
    <div className="flex gap-2">
      <Icon width={iconWidth} height={iconHeight} className={iconClassName} />
      <span className={textClassName}>{text}</span>
    </div>
  );
};

const FridaySalePopup = ({ deal }) => {
  const [loadingState, setLoadingState] = useState({
    premium: false,
    scale: false,
  });

  const isMobile = useClientMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userSubscription = useSelector((state) => state.userSubscription);

  const handlePayment = async (plan, coupon, buttonType) => {
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

    const apiEndpoint = process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/checkout";

    const formData = new FormData();
    formData.append("plan", plan);

    if (coupon) {
      formData.append("coupon", coupon);
    }

    if (currentUser?.uid) {
      formData.append("user_id", currentUser.uid);
    }

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);

    url.search = "";

    const successUrl = `${url.href}?paymentSuccess=true`;
    const cancelUrl = `${url.href}?paymentFailed=true`;

    formData.append("success_url", successUrl);
    formData.append("cancel_url", cancelUrl);

    setLoadingState((prev) => ({ ...prev, [buttonType]: true }));

    try {
      const response = await axios.post(apiEndpoint, formData);

      if (response?.data?.status === "success") {
        window.location.href = response.data.url;
      } else {
        const errorMessage = response?.data?.[0] || response?.data;
        const isSubscriptionError =
          typeof errorMessage === "string" &&
          (errorMessage.includes("Subscription already exists") ||
            errorMessage.includes(
              "Subscription already exists, Please cancel current subscription plan for new subscription plan"
            ));

        if (isSubscriptionError) {
          dispatch(
            showToaster({
              variant: "error",
              title:
                "You already have an active subscription. Please cancel your current plan before purchasing a new one.",
              description: "",
            })
          );
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
    } finally {
      setLoadingState((prev) => ({ ...prev, [buttonType]: false }));
    }
  };

  return (
    <div className="cursor-auto">
      <MdOutlineClose
        size={22}
        className={`dark:text-[#ffffff8a] cursor-pointer text-[#9e9e9e]  ${
          isMobile ? "right-[10px] top-[10px] fixed" : "absolute right-[30px] "
        }`}
        onClick={() => dispatch(hidePopup())}
      />
      {/* header */}
      <div className="px-7">
        <div>
          <h1 className="text-2xl font-[Inter,sans-serif] font-semibold dark:text-white text-[#131314] text-center md:text-left">
            {deal == "cyberMonday"
              ? "Cyber Monday Extended Deal  👾"
              : "Black Friday Deal 🎉"}
          </h1>
        </div>
        <div className="flex gap-1.5 items-center flex-col md:flex-row mt-2 md:mt-0">
          <p className="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-[#131314] text-center md:text-left">
            Get unbeatable price with an annual subscription — hurry, deals end
            soon in
          </p>
          <div className="bg-[#e4e5ea] dark:bg-[#373739] rounded-[99px] py-2 px-3 mt-2 md:mt-0">
            {/* <span className="text-sm font-[Inter,sans-serif] font-bold dark:text-white text-[#131314]">
              14:55:33
            </span> */}
            <CountdownTimer
              endDate={`${
                deal == "cyberMonday"
                  ? "2024-12-08T08:00:00Z"
                  : "2024-12-01T23:59:59"
              }`}
            />
          </div>
        </div>
      </div>

      {/* plans */}
      <div className="border-y dark:border-[#373739] border-lightBorder mt-4 flex md:flex-row flex-col">
        {/* annual premium plan */}
        <div className="md:w-1/2 w-full pt-5 pb-[18px] px-7">
          <div className="">
            <h3 className="text-xl font-[Inter,sans-serif] font-semibold dark:text-white text-[#131314]">
              Premium Annual plan
            </h3>{" "}
          </div>
          <p className="text-sm font-[Inter,sans-serif] font-medium dark:text-[#dedede] text-[#212121] mt-1">
            Buy now
          </p>
          <div className="mt-7">
            <span className="text-sm font-[Inter,sans-serif] font-medium dark:text-white text-[#131314]">
              {deal == "cyberMonday" ? "👨‍💻 18% discount" : "⚡ 10% discount"}
            </span>
          </div>

          {/* price */}
          <div className="mt-1 flex items-center gap-3 ">
            <span className="text-[34px] font-[Inter,sans-serif] font-bold dark:text-white text-[#131314]">
              {deal == "cyberMonday" ? "$179" : "$199"}
            </span>
            <span className="text-[22px] font-[Inter,sans-serif] font-semibold  text-[#757575] dark:text-[#8a8a8a] pt-2 line-through">
              $216
            </span>
          </div>
          <span className="text-sm font-[Inter,sans-serif] font-normal dark:text-[#8a8a8a] text-[#757575] mt-1">
            Discount applicable for 1st year
          </span>
          <Button
            variant="secondary"
            size="medium"
            className="!w-full !px-0 !py-4 !rounded-lg hover:brightness-90 !bg-[#40475b] dark:!bg-[#6c707a] font-[Inter] dark:!text-white !text-base !border !border-[#40475b]  mt-6"
            onClick={() => {
              let coupon;

              if (deal == "cyberMonday") {
                coupon =
                  process.env.NEXT_PUBLIC_ENV === "prod"
                    ? process.env.NEXT_PUBLIC_ANNUAL_PLAN_COUPON_CYBER_MONDAY
                    : process.env
                        .NEXT_PUBLIC_DEFAULT_ANNUAL_PLAN_COUPON_CYBER_MONDAY;
              } else {
                coupon =
                  process.env.NEXT_PUBLIC_ENV === "prod"
                    ? process.env.NEXT_PUBLIC_ANNUAL_PLAN_COUPON
                    : process.env.NEXT_PUBLIC_DEFAULT_ANNUAL_PLAN_COUPON;
              }

              handlePayment(
                process.env.NEXT_PUBLIC_ANNUAL_PREMIUM_PLAN,
                coupon,
                "premium"
              );
            }}
            disabled={
              loadingState.premium ||
              userSubscription?.user_info?.subscription_plan ==
                process.env.NEXT_PUBLIC_ANNUAL_PREMIUM_PLAN
            }
          >
            <span className="text-base font-[Inter,sans-serif] font-semibold dark:text-white text-white">
              {userSubscription?.user_info?.subscription_plan ==
              process.env.NEXT_PUBLIC_ANNUAL_PREMIUM_PLAN
                ? "Your Premium Annual Plan is Active"
                : loadingState.premium
                ? "Processing..."
                : "Get Premium"}
            </span>
          </Button>

          {/* features */}
          <div className="mt-6">
            <h4 className="text-base font-[Inter,sans-serif] font-medium dark:text-white text-[#131314]">
              Enjoy Premium Annual plan benefits:
            </h4>
            <div className="mt-3 flex flex-col gap-2.5">
              <InfoItem
                Icon={HiCheckCircle}
                text="Upto 3 Custom GPT Agents;"
                iconClassName="w-5 h-5 text-[#9e9e9e] dark:text-[#616161]"
                textClassName="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-[#131314]"
              />
              <InfoItem
                Icon={HiCheckCircle}
                text="Upto 1 million Compute Points per month;"
                iconClassName="w-5 h-5 text-[#9e9e9e] dark:text-[#616161]"
                textClassName="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-[#131314]"
              />
              <InfoItem
                Icon={HiCheckCircle}
                text="Upto 2 integrations;"
                iconClassName="w-5 h-5 text-[#9e9e9e] dark:text-[#616161]"
                textClassName="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-[#131314]"
              />
              <InfoItem
                Icon={HiCheckCircle}
                text="1.5 million total tokens ingested;"
                iconClassName="w-5 h-5 text-[#9e9e9e] dark:text-[#616161]"
                textClassName="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-[#131314]"
              />
              <InfoItem
                Icon={HiCheckCircle}
                text="Add your custom API Keys"
                iconClassName="w-5 h-5 text-[#9e9e9e] dark:text-[#616161]"
                textClassName="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-[#131314]"
              />
            </div>
          </div>
        </div>

        {/* annual scale plan  */}
        <div className="md:w-1/2 w-full  pt-5 pb-[18px] px-7 border-l border-lightBorder dark:border-[#373739]">
          <div className="">
            <h3 className="text-xl font-[Inter,sans-serif] font-semibold dark:text-white text-[#131314]">
              Scale Plan - 1 year Subscription
            </h3>{" "}
          </div>
          <p className="text-sm font-[Inter,sans-serif] font-semibold dark:text-[#faff69] text-[#745ffb] mt-1">
            Limited-time offer
          </p>
          <div className="mt-7">
            <span className="text-sm font-[Inter,sans-serif] font-medium dark:text-white text-[#131314]">
              {deal == "cyberMonday" ? "🌟 36% discount" : "🔥 47% discount"}
            </span>
          </div>

          {/* price */}
          <div className="mt-1 flex items-center gap-3 ">
            <span className="text-[34px] font-[Inter,sans-serif] font-bold dark:text-white text-[#131314]">
              {deal == "cyberMonday" ? "$299" : "$249"}
            </span>
            <span className="text-[22px] font-[Inter,sans-serif] font-semibold dark:text-[#8a8a8a] text-[#757575] pt-2 line-through">
              $468
            </span>
          </div>
          <span className="text-sm font-[Inter,sans-serif] font-normal dark:text-[#8a8a8a] text-[#757575] mt-1">
            Discount applicable for 1st year
          </span>
          <Button
            variant="secondary"
            size="medium"
            className="!w-full !py-4 !rounded-lg hover:brightness-90 !bg-[#745ffb]  font-[Inter] dark:!text-white !text-base  !border !border-[#745ffb]  mt-6"
            onClick={() => {
              let coupon;

              if (deal === "cyberMonday") {
                coupon =
                  process.env.NEXT_PUBLIC_ENV === "prod"
                    ? process.env.NEXT_PUBLIC_SCALE_PLAN_COUPON_CYBER_MONDAY
                    : process.env
                        .NEXT_PUBLIC_DEFAULT_SCALE_PLAN_COUPON_CYBER_MONDAY;
              } else {
                coupon =
                  process.env.NEXT_PUBLIC_ENV === "prod"
                    ? process.env.NEXT_PUBLIC_SCALE_PLAN_COUPON
                    : process.env.NEXT_PUBLIC_DEFAULT_SCALE_PLAN_COUPON;
              }

              handlePayment(
                process.env.NEXT_PUBLIC_ANNUAL_SCALE_PLAN,
                coupon,
                "scale"
              );
            }}
            disabled={loadingState.scale}
          >
            <span className="text-base font-[Inter,sans-serif] font-semibold dark:text-white text-white">
              {loadingState.scale ? "Processing..." : "Purchase Scale Plan"}
            </span>
          </Button>

          {/* features */}
          <div className="mt-6">
            <h4 className="text-base font-[Inter,sans-serif] font-medium dark:text-white text-[#131314]">
              Enjoy Scale Annual plan benefits:
            </h4>
            <div className="mt-3 flex flex-col gap-2.5">
              <InfoItem
                Icon={HiCheckCircle}
                text={
                  <>
                    <span className="font-semibold">Unlimited</span> GPT Agents;
                  </>
                }
                iconClassName="w-5 h-5 text-[#31a133]"
                textClassName="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-[#131314]"
              />
              <InfoItem
                Icon={HiCheckCircle}
                text={
                  <>
                    Upto <span className="font-semibold">3 million</span>{" "}
                    Compute Points per month;
                  </>
                }
                iconClassName="w-5 h-5 text-[#31a133]"
                textClassName="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-[#131314]"
              />
              <InfoItem
                Icon={HiCheckCircle}
                text={
                  <>
                    Use <span className="font-semibold">all integrations</span>{" "}
                    available;
                  </>
                }
                iconClassName="w-5 h-5 text-[#31a133]"
                textClassName="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-[#131314]"
              />
              <InfoItem
                Icon={HiCheckCircle}
                text={
                  <>
                    <span className="font-semibold">5 million</span> total
                    tokens ingested;
                  </>
                }
                iconClassName="w-5 h-5 text-[#31a133]"
                textClassName="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-[#131314]"
              />
              <InfoItem
                Icon={HiCheckCircle}
                text={
                  <>
                    <span className="font-semibold">
                      Unlimited OpenAI, Claude API keys
                    </span>
                  </>
                }
                iconClassName="w-5 h-5 text-[#31a133]"
                textClassName="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-[#131314]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="mt-6 text-center">
        <span className="text-sm font-[Inter,sans-serif] font-normal dark:text-[#8a8a8a] text-[#757575]">
          <span
            className="underline cursor-pointer"
            style={{ textUnderlineOffset: "2px" }}
            onClick={() => {
              window.open(
                `${"https://www.getbind.co/pricing"}`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            Compare plans
          </span>{" "}
          to learn more
        </span>
      </div>
    </div>
  );
};

export default FridaySalePopup;
