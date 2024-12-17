import Button from "@/components/ui/Button";
import Image from "next/image";
import React from "react";

const Onboarding = ({
  question,
  subType,
  desc,
  options,
  selectedOption,
  onOptionClick,
  onContinue,
}) => {
  return (
    <>
      <div className="w-full max-w-2xl mx-auto text-center">
        <h1 className="md:text-[28px] text-[25px] font-[600] text-primary mb-2">
          {question}
        </h1>
        <p className="md:text-lg text-[16px] font-normal mb-8 text-primary">
          {desc}
        </p>
        <div
          className={`flex ${
            subType !== "theme" && " flex-wrap"
          } justify-center max-w-lg gap-4  mx-auto mb-6`}
        >
          {subType == "theme"
            ? options.map((option, index) => (
                <div key={option} onClick={() => onOptionClick(option)} className="my-5">
                  <Image
                    key={index}
                    src={`/images/${option == "Dark" ? "dark" : "light"}.png`}
                    alt="dark"
                    width={250}
                    height={250}
                    className={`rounded-lg border-[2px] theme ${
                      selectedOption === option
                        ? "border-[3px] border-[#745FFB] "
                        : "border-white bg-white hover:bg-gray-100 hover:border-gray-100"
                    }`}
                  />

                  <p className="font-medium md:text-base text-sm text-[#745FFB] mt-3">
                    {option}
                  </p>
                </div>
              ))
            : options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => onOptionClick(option)}
                  className={`px-3 py-3 option rounded-lg border-[2px] text-[16px] font-[500] text-label ${
                    selectedOption === option
                      ? "border-[2px] border-[#745FFB] bg-white"
                      : "border-white bg-white hover:bg-gray-100 hover:border-gray-100"
                  } ${
                    option.length > 26
                      ? "w-full"
                      : "md:w-[calc(50%-0.5rem)] w-[90%]"
                  }`}
                >
                  {option}
                </div>
              ))}
        </div>
        <div className="w-full max-w-lg mx-auto">
          <Button
            variant="secondary"
            size="large"
            className={`w-full max-w-lg !rounded-lg ${
              selectedOption
                ? "!bg-darkMutedPurple text-white"
                : "!bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={onContinue}
            disabled={!selectedOption}
          >
            <p className="text-[16px] font-[500]">Continue</p>
          </Button>
        </div>
      </div>
      <style>
        {`
          .option {
            box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.06);
          }
          .theme {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1),
              0 4px 8px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </>
  );
};

export default Onboarding;
