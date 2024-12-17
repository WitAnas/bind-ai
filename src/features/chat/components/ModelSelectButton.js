import ModelCategoryContainer from "@/components/common/chat/ModelCategoryContainer";
import { setLatestModel } from "@/redux/reducers/botReducer";
import { showPopup } from "@/redux/reducers/commonReducer";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const ModelSelectorButton = ({ onModelChange, botId, getBotData }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const latestModel = useSelector((state) => state.bot.latestModel);

  const handleModelChange = (newModel) => {
    const botData = getBotData(botId);
    botData.model = newModel;
    localStorage.setItem(botId, JSON.stringify(botData));

    // setLatestModel(newModel);
    dispatch(setLatestModel(newModel));
  };

  const handlePickModels = () => {
    dispatch(
      showPopup({
        title: "",
        description: (
          <ModelCategoryContainer
            onModelChange={onModelChange ? onModelChange : handleModelChange}
          />
        ),
        btnArray: [],
        classAdditions: {
          popupContainer: "w-full md:w-1/4",
          popup: "h-screen !rounded-none w-full md:h-auto md:!rounded-lg",
        },
      })
    );
  };

  return (
    <div
      className="pick-models-button dark:border-darkPrimary flex items-center justify-center gap-1 font-normal text-sm rounded-3xl cursor-pointer bg-white dark:bg-darkBotPrimary"
      onClick={handlePickModels}
    >
      {latestModel?.label ? (
        <div className="flex justify-center items-center gap-2">
          {latestModel?.svg ? (
            <Image
              src={`/svgs/${latestModel?.icon}.svg`}
              alt={latestModel.label}
              width={20}
              height={20}
            />
          ) : (
            <Image
              src={`/images/${latestModel?.icon}.png`}
              alt={latestModel.label}
              width={20}
              height={20}
            />
          )}
          <p className="font-normal text-sm text-[#1C274C] dark:text-white">
            {" "}
            {latestModel.label.length > 10
              ? latestModel.label.slice(0, 10) + ".."
              : latestModel.label}
          </p>
        </div>
      ) : (
        <span className=" text-[#1C274C] dark:text-white">Pick Models</span>
      )}
      <Image
        src={`${
          darkMode ? "/svgs/chevron-down.svg" : "/images/chevron-down.png"
        }`}
        alt="Pick Models"
        width={17}
        height={17}
      />
      <style>
        {`
         .pick-models-button {
             box-sizing: border-box;
             border: 1px solid #E4E5EA;
             box-shadow: 0px 2px 12px rgba(28, 39, 76, 0.11);
             padding: 10px 18px;
             font-size: 14px;
             color: rgb(28, 39, 76); 
             position: absolute;
             top: 10%; 
             left: 50%;
             transform: translateX(-50%);
             pointer-events: auto; 
             z-index: 10;  
            //  width:150px;
         }
         
            `}
      </style>
    </div>
  );
};

export default ModelSelectorButton;
