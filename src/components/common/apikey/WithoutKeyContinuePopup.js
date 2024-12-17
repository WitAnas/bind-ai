import React, { useState } from "react";

import { MdOutlineClose } from "react-icons/md";
import { hidePopup, showPopup } from "@/redux/reducers/commonReducer";
import { useDispatch, useSelector } from "react-redux";
import BindFeaturesList from "../BindFeaturesList";
import { FaArrowLeft } from "react-icons/fa";

import { ModelCategory } from "@/features/chat/constants";
import { setLatestModel } from "@/redux/reducers/botReducer";
import { useClientMediaQuery } from "@/features/hooks";

export const handleSelectDefaultModel = (currentBotId, dispatch) => {
  const currentDefaultModel =
    currentBotId == "660f2def795718a92af22fc1"
      ? "codestral-latest"
      : "gpt-4o-mini";

  const defaultModel = ModelCategory.find(
    (obj) => obj.value == "advanced_models"
  )?.botList.find((bot) => bot.value == currentDefaultModel);

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

  botData.model = defaultModel;
  localStorage.setItem(
    currentBotId ? currentBotId : "661cacc79657814effd8db6c",
    JSON.stringify(botData)
  );
  dispatch(setLatestModel(defaultModel));

  dispatch(hidePopup());
};

const WithoutKeyContinuePopup = () => {
  const currentBotId = useSelector((state) => state.bot.currentBotId);
  const dispatch = useDispatch();
  const isMobile = useClientMediaQuery("(max-width: 600px)");

  const handleAddKeyClick = () => {
    // dispatch(
    //   showPopup({
    //     title: "",
    //     description: <ApiKeyPopup />,
    //     btnArray: [],
    //     classAdditions: {
    //       popupContainer: `
    //      w-[720px] 
    //     `,
    //       popup:
    //         " !w-full !border dark:border-[#ffffff1e] dark:bg-[#26282c] p-7",
    //     },
    //   })
    // );
  };

  return (
    <div className="cursor-auto">
      <MdOutlineClose
        size={22}
        className={`dark:text-[#ffffff8a] absolute ${
          isMobile ? "right-[-15px] top-[-15px]" : " right-[-10px] top-[-10px]"
        } cursor-pointer text-primary`}
        onClick={() => dispatch(hidePopup())}
      />
      <div>
        <h1 className="text-2xl font-[Inter,sans-serif] font-semibold dark:text-white text-primary">
          Benefits of adding your API Key
        </h1>
        <p className="text-sm font-[Inter,sans-serif] font-normal dark:text-white mt-2 text-primary">
          {/* Create a key and add it to Bind — it&apos;s very simple and takes just
          2 minutes. Here&apos;s our{" "}
          <span className="underline" style={{ textUnderlineOffset: "3px" }}>
            brief guide
          </span>{" "}
          for you to follow. */}
          Adding keys takes just 2 minutes.
        </p>
        <h3 className="text-base  font-medium dark:text-white mt-6 text-primary">
          <span
            className="underline cursor-pointer"
            style={{ textUnderlineOffset: "3px" }}
            onClick={() =>
              window.open(
                `https://www.getbind.co/use-claude-ai-with-your-api-key`,
                "_blank"
              )
            }
          >
            Here&apos;s a list of benefits
          </span>{" "}
          you&apos;ll get by adding your own API keys:
        </h3>
        <div className="mt-4">
          <BindFeaturesList content={"apikey"} />
        </div>
        <div className="h-[1px] w-full bg-white12 mt-7"></div>
        <div className="mt-8 flex md:flex-row flex-col items-center justify-between mb-1 md:gap-0 gap-2">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleAddKeyClick}
          >
            <FaArrowLeft size={18} className={`dark:text-white`} />
            <h3 className="font-medium text-base font-[Inter,sans-serif] dark:text-white text-primary">
              Go back and add the key
            </h3>
          </div>
          <h3
            className="font-medium text-base font-[Inter,sans-serif] dark:text-white87 cursor-pointer text-primary"
            onClick={() => {
              handleSelectDefaultModel(currentBotId, dispatch);
            }}
          >
            Continue without adding API keys
          </h3>
        </div>
      </div>
    </div>
  );
};

export default WithoutKeyContinuePopup;
