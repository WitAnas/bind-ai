import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

const CanvasTabs = ({ currentTab, setCurrentTab }) => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  // const tabs = ["HOME", "CODE", "STDIN", "SYSTEM PARAMS"];
  const tabs = ["CODE"];

  return (
    <div>
      <div className="flex justify-between items-center p-3 pb-2">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`text-[15px] font-normal cursor-pointer ${
                currentTab === tab
                  ? "border-b dark:border-[white] border-[#1C274C] text-primary  dark:text-white dark:font-normal font-[600]"
                  : "dark:text-tertiary text-label font-normal"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <span className="mr-2 font-normal text-sm dark:text-white text-label">
            FileName
          </span>
          <Image
            src={`${
              darkMode ? "/svgs/chevron-down.svg" : "/images/chevron-down.png"
            }`}
            alt="chevron down"
            width={17}
            height={17}
          />
        </div>
      </div>
      <div
        className="border-b dark:border-darkPrimary  border-lightBorder"
        style={{
          width: "100%",
          backgroundColor: "#3A4363",
        }}
      ></div>
    </div>
  );
};

export default CanvasTabs;
