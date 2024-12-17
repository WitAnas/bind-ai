import React, { useState } from "react";
import { RiShareBoxLine } from "react-icons/ri";
import { MdCheck, MdContentCopy, MdOutlineClose } from "react-icons/md";
import { hidePopup, showToaster } from "@/redux/reducers/commonReducer";
import { useDispatch } from "react-redux";
import { useClientMediaQuery } from "@/features/hooks";
import copy from "copy-to-clipboard";
import { FaCheck } from "react-icons/fa";

const GptAgentSuccessPopup = ({ botId }) => {
  const dispatch = useDispatch();
  const isMobile = useClientMediaQuery("(max-width: 600px)");
  const [copied, setCopied] = useState(false);
  const link = `https://copilot.getbind.co/chat/${
    botId ? botId : "c99d8c5c-4aca"
  }`;

  const handleCopy = () => {
    copy(link ? link : "");
    setCopied(true);

    dispatch(
      showToaster({
        variant: "success",
        title: "Link copied to clipboard!",
        description: "",
      })
    );

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="relative">
      <MdOutlineClose
        size={22}
        className={`dark:text-[#ffffff8a] text-[#848a9e]  ${
          isMobile
            ? "right-[-5px] top-[-5px] absolute"
            : "absolute right-[-10px] top-[-10px]"
        }`}
        onClick={() => dispatch(hidePopup())}
      />
      <div className="cursor-auto">
        <h1 className="text-primary dark:text-white font-semibold text-2xl ">
          Agent successfully created
        </h1>
        <p className="text-label text-base dark:text-white font-normal mt-6">
          Your custom GPT agent is now created. You can select any
          <br /> model which is accessible with your plan.
        </p>
        <div
          className="mt-14 rounded-lg border border-r-lightBorder py-1 pr-1 pl-4 flex justify-between w-full h-14 cursor-pointer"
          style={{
            boxShadow: "0 2px 4px 0 rgba(28, 39, 76, 0.07)",
          }}
        >
          <div className="relative flex-grow h-full flex items-center overflow-hidden">
            <p className="text-primary dark:text-white font-medium text-base whitespace-nowrap overflow-hidden ">
              {link}
            </p>

            <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white dark:from-[#26282c] to-transparent"></div>
          </div>
          <div className="flex items-center  gap-1 min-w-fit min-h-fit">
            <div
              className=" bg-darkMutedPurple h-full px-4 rounded-lg flex items-center gap-2   hover:brightness-90 transition-all duration-200 ease-in-out"
              onClick={handleCopy}
            >
              {copied ? (
                <FaCheck
                  size={15}
                  height={18}
                  width={15}
                  className="text-white w-[15px] h-[18px]"
                />
              ) : (
                <MdContentCopy
                  size={22}
                  height={22}
                  width={18}
                  className="text-white w-[18px] h-[22px]"
                />
              )}
              <span className="text-white text-base font-medium">
                {copied ? "Copied!" : "Copy link"}
              </span>
            </div>
            <div
              className="h-full rounded-lg bg-[#e4e5ea]  flex items-center justify-center px-2 hover:brightness-90 transition-all duration-200 ease-in-out cursor-pointer"
              onClick={() => {
                if (link) {
                  window.open(link, "_blank");
                }
              }}
            >
              <RiShareBoxLine
                size={22}
                className="text-[#5f6368] w-[22px] h-[22px]"
              />
            </div>
          </div>
        </div>
        <p className="text-label text-base dark:text-white font-normal mt-2">
          This agent is private and available only for you.
        </p>
      </div>
    </div>
  );
};

export default GptAgentSuccessPopup;
