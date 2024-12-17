import { hidePopup, showPopup } from "@/redux/reducers/commonReducer";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PremiumPopup from "../premium/PremiumPopup";
import {
  hasActivePremiumSubscription,
  hasActiveTrialSubscription,
} from "@/utils/subscription";
import moment from "moment";
import { setLatestModel } from "@/redux/reducers/botReducer";
import SumoUsersLimitPopup from "@/features/sumo-app/components/SumoUsersLimitPopup";

const ModelSelectorContainer = ({ model, onModelChange }) => {
  const [selectedModel, setSelectedModel] = useState(null);
  const userSubscription = useSelector((state) => state.userSubscription);
  const currentBotId = useSelector((state) => state.bot.currentBotId);

  const dispatch = useDispatch();

  const handleClick = (model) => {
    setSelectedModel(model?.label);

    if (
      model?.type === "premium" &&
      ((!hasActivePremiumSubscription(userSubscription) &&
        !hasActiveTrialSubscription(userSubscription) &&
        !userSubscription?.sumo_data) ||
        (userSubscription?.sumo_data &&
          !userSubscription?.sumo_data?.features?.advance_models?.is_available))
    ) {
      dispatch(
        showPopup({
          title: "",
          description: (
            <SumoUsersLimitPopup
              feature="query"
              h1={
                userSubscription?.sumo_data
                  ? "You have reached the limit"
                  : "Try 15+ Advanced Models"
              }
              h2={
                userSubscription?.sumo_data
                  ? "for current Tier"
                  : "with Bind AI Premium"
              }
              desc={
                <>
                  Get access to the most advanced AI models for code
                  <br /> generation, technical writing, complex reasoning.
                </>
              }
              features={["OpenAI GPT-4o", "Claude 3.5 Sonnet", "Llama 3.1"]}
              ctaHeading={
                userSubscription?.sumo_data
                  ? "Upgrade to Next Tier"
                  : userSubscription?.user_info?.trial_available === true ||
                    userSubscription?.user_info?.trial_available === "true"
                  ? "Start a 7 day Trial"
                  : "Subscribe Now"
              }
            />
          ),
          btnArray: [],
          classAdditions: {
            popupContainer: "w-[510px]",
            popup:
              "!w-full !border dark:border-[#ffffff1e] dark:bg-[#26282c] px-7",
          },
        })
      );
    } else {
      if (onModelChange) {
        onModelChange(model);
        dispatch(hidePopup());
      } else {
        const botData =
          JSON.parse(
            localStorage.getItem(
              currentBotId ? currentBotId : "661cacc79657814effd8db6c"
            )
          ) || {};

        if (!botData.sessionKey) {
          botData.sessionKey = Math.random().toString(36).substring(2, 15);
          localStorage.setItem(
            currentBotId ? currentBotId : "661cacc79657814effd8db6c",
            JSON.stringify(botData)
          );
        }

        botData.model = model;
        localStorage.setItem(
          currentBotId ? currentBotId : "661cacc79657814effd8db6c",
          JSON.stringify(botData)
        );
        dispatch(setLatestModel(model));

        dispatch(hidePopup());
      }
    }
  };

  return (
    <div
      className={`mt-2.5 py-2 pl-2.5 mr-4 flex items-start ${
        selectedModel === model?.label &&
        "border border-[#4529FA] rounded-md bg-[#F5F5FF]"
      } hover:bg-[#F1F0FA80] hover:rounded-md`}
      onClick={() => {
        handleClick(model);
      }}
    >
      {model?.svg ? (
        <Image
          src={`/svgs/${model?.icon}.svg`}
          className="mr-2.5"
          alt="Pick Models"
          width={36}
          height={36}
        />
      ) : (
        <Image
          src={`/images/${model?.icon}.png`}
          className="mr-2.5"
          alt="Pick Models"
          width={36}
          height={36}
        />
      )}
      <div>
        <div className="flex items-center">
          <p className="text-[14px] font-semibold">{model.label}</p>
          {model?.type === "premium" && (
            <Image
              src={`/images/premium.png`}
              alt="premium"
              width={20}
              height={20}
            />
          )}
        </div>
        <p className="text-[13px] font-normal text-primary">
          {model.description}
        </p>
        <span className="text-xs font-medium py-1 px-[6px] bg-[#FEE4BF] rounded-lg mt-[6px]">
          {model.contextWindow}
        </span>
      </div>
    </div>
  );
};

export default ModelSelectorContainer;
