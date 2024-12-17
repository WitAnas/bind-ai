import FridaySalePopup from "@/components/common/deals/FridaySalePopup";
import Icon from "@/components/common/Icon";
import Button from "@/components/ui/Button";
import { useClientMediaQuery } from "@/features/hooks";
import { handlePayment } from "@/features/onboarding/components/SubscriptionStep";
import { hidePopup, showPopup } from "@/redux/reducers/commonReducer";
import {
  hasActivePremiumSubscription,
  hasActiveTrialSubscription,
} from "@/utils/subscription";
import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const SumoUsersLimitPopup = ({
  feature,
  h1,
  h2,
  desc,
  features,
  ctaHeading,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const isMobile = useClientMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userSubscription = useSelector((state) => state.userSubscription);

  const handlePaymentClick = async () => {
    setIsLoading(true);
    try {
      if (userSubscription?.sumo_data) {
        window.open(`${"https://appsumo.com/account/products/"}`, "_blank");
      } else if (
        (hasActiveTrialSubscription(userSubscription) ||
          !hasActivePremiumSubscription(userSubscription)) &&
        feature == "integration"
      ) {
        dispatch(
          showPopup({
            title: "",
            description: <FridaySalePopup />,
            btnArray: [],
            classAdditions: {
              popupContainer: `
               w-[750px] 
              `,
              popup:
                " !w-full !border dark:border-[#ffffff1e] border-[#E4E5EA] dark:bg-[#26282c] py-7",
            },
          })
        );
      } else {
        await handlePayment(currentUser, dispatch);
      }
    } catch (error) {
      console.log("Payment handling error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cursor-auto relative">
      <MdOutlineClose
        size={22}
        className={`cursor-pointer dark:text-[#ffffff8a] text-primary  ${
          isMobile
            ? "absolute right-[-10px] top-[-20px] "
            : "absolute right-[-10px] top-[-35px]"
        }`}
        onClick={() => dispatch(hidePopup())}
      />
      <div className="mt-14 flex items-center justify-center gap-[7.5px]">
        {feature === "query" ? (
          <>
            <div className="w-16 h-16 shadow-[3.4px_6.7px_19px_0_rgba(0,0,0,0.25)] border-[0.6px] border-[#00000033] dark:bg-white rounded-full flex justify-center items-center">
              <Icon
                type={"mistral-icon"}
                width={36}
                height={36}
                fill={darkMode ? "white" : "black"}
                className=" w-9 h-9"
              />
            </div>
            <div className="w-16 h-16 shadow-[3.4px_6.7px_19px_0_rgba(0,0,0,0.25)] border-[0.6px] border-[#00000033] dark:bg-white rounded-full flex justify-center items-center">
              <Icon
                type={"openai-icon"}
                width={40}
                height={40}
                fill={"black"}
                className=" w-10 h-10"
              />
            </div>
            <div className="w-16 h-16 shadow-[3.4px_6.7px_19px_0_rgba(0,0,0,0.25)] border-[0.6px] border-[#00000033] dark:bg-white rounded-full flex justify-center items-center">
              <Icon
                type={"claude-icon"}
                width={40}
                height={40}
                fill={darkMode ? "white" : "black"}
                className=" w-10 h-10"
              />
            </div>
            <div className="w-16 h-16 shadow-[3.4px_6.7px_19px_0_rgba(0,0,0,0.25)] border-[0.6px] border-[#00000033] dark:bg-white rounded-full flex justify-center items-center">
              <Icon
                type={"infinity-icon"}
                width={91}
                height={90}
                fill={darkMode ? "white" : "black"}
                className=" w-24 h-24 flex items-center justify-center mt-3  ml-1"
              />
            </div>
          </>
        ) : feature == "gptagent" ? (
          <>
            {" "}
            <div className="w-16 h-16 shadow-[3.4px_6.7px_19px_0_rgba(0,0,0,0.25)] border-[0.6px] border-[#00000033] dark:bg-white rounded-full flex justify-center items-center">
              <Icon
                type={"gpt-agent"}
                width={40}
                height={40}
                fill={"black"}
                className=" w-10 h-10"
              />
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 shadow-[3.4px_6.7px_19px_0_rgba(0,0,0,0.25)] border-[0.6px] border-[#00000033] dark:bg-white rounded-full flex justify-center items-center">
              <Icon
                type={"github-icon"}
                width={40}
                height={40}
                className=" w-10 h-10"
              />
            </div>
            <div className="w-16 h-16 shadow-[3.4px_6.7px_19px_0_rgba(0,0,0,0.25)] border-[0.6px] border-[#00000033] dark:bg-white rounded-full flex justify-center items-center">
              <Icon
                type={"drive-icon"}
                width={40}
                height={40}
                className=" w-10 h-10"
              />
            </div>
            <div className="w-16 h-16 shadow-[3.4px_6.7px_19px_0_rgba(0,0,0,0.25)] border-[0.6px] border-[#00000033] dark:bg-white rounded-full flex justify-center items-center">
              <Icon
                type={"upload-icon"}
                width={90}
                height={90}
                fill={!darkMode ? "white" : "black"}
                className=" w-24 h-24 flex items-center justify-center mt-3  ml-1"
              />
            </div>
          </>
        )}
      </div>
      <div className="mt-7 text-2xl font-semibold dark:text-white font-[Inter,sans-serif] flex justify-center items-center text-centers">
        <h1 className="text-center">
          {h1 ? h1 : "Try 15+ Advanced Models "}
          <br />
          <span className="font-normal">
            {h2 ? h2 : "with Bind AI Premium"}
          </span>
        </h1>
      </div>
      <p className="mt-4 text-sm font-normal font-[Inter,sans-serif] dark:text-white87 text-center flex justify-center items-center">
        {desc
          ? desc
          : ` Get access to the most advanced AI models for code
        <br /> generation, technical writing, complex reasoning.`}
      </p>
      <div className="mt-7 text-base font-medium dark:text-white flex flex-col md:flex-row items-center md:justify-center gap-1">
        <span>
          {features && features.length > 0 ? features[0] : "OpenAI GPT-4o"}
        </span>
        <span className="text-[#373739]">•</span>
        <span>
          {" "}
          {features && features.length > 0 ? features[1] : "Claude 3.5 Sonnet"}
        </span>
        <span className="text-[#373739]">•</span>
        <span>
          {features && features.length > 0 ? features[2] : "Llama 3.1"}
        </span>
      </div>
      <div className="h-[1px] dark:bg-white12 bg-[#E4E5EA] mt-10"></div>
      <Button
        variant="primary"
        size="medium"
        className=" !bg-[#faff69] mt-6 !py-3.5 !rounded-lg flex items-center  hover:brightness-90  w-full"
        onClick={handlePaymentClick}
        disabled={isLoading}
      >
        <span className="text-[#000000de] text-base font-semibold">
          {isLoading
            ? "Processing..."
            : `${ctaHeading ? ctaHeading : "Start a 7 day trial"}`}
        </span>
      </Button>
      <span
        className="mt-5 mb-6 text-sm font-normal dark:text-[#ffffff8a] flex justify-center items-center cursor-pointer"
        onClick={() => {
          window.open(
            `${"https://www.getbind.co/pricing"}`,
            "_blank",
            "noopener,noreferrer"
          );
        }}
      >
        View all plans
      </span>
    </div>
  );
};

export default SumoUsersLimitPopup;
