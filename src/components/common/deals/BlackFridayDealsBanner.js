import Button from "@/components/ui/Button";
import { showPopup } from "@/redux/reducers/commonReducer";
import React from "react";
import FridaySalePopup from "./FridaySalePopup";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineClose } from "react-icons/md";
import { handleDealsNavButtonClick } from "@/app/(user)/layout";
import DealsNavButton from "../chat/DealsNavButton";
import CountdownTimer from "./CountdownTimer";

const BlackFridayDealsBanner = ({ v, deal, onClose }) => {
  const userSubscription = useSelector((state) => state.userSubscription);

  const dispatch = useDispatch();
  return (
    <>
      <div
        className={`relative dark:bg-[#26282c] bg-white p-4 border dark:border-[#373739] border-lightBorder rounded-xl shadow-[0_2px_6px_0_rgba(0,0,0,0.08)] flex justify-between ${
          deal == "second" ? "" : "items-center"
        } `}
      >
        {v == "v2" ? (
          <>
            <div className="absolute top-[-4px] transform -translate-y-1/2 dark:bg-darkProject bg-[#fbfbfc] border dark:border-[#373739]  border-lightBorder rounded-[99px] py-2 px-3.5 flex gap-2">
              <p className="dark:text-white text-sm font-medium  text-[#131314]">
                The discount will end in:
              </p>{" "}
              <CountdownTimer endDate="2024-12-08T08:00:00Z" />
            </div>

            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold dark:text-white text-[#131314]">
                  {deal == "second" ? "Premium Annual plan" : "  Scale Plan"}{" "}
                  <span className="text-sm font-normal dark:text-[#dedede] text-[#212121]">
                    {deal == "second" ? "🎁 18% discount" : " 🎁 36% discount"}
                  </span>
                </h2>

                <p className="text-sm font-normal dark:text-white text-[#212121] mt-0.5">
                  Get a 1-Year Subscription at an Unbeatable Price
                </p>
              </div>
              <div>
                {deal == "second" && (
                  <h2 className="dark:text-white text-sm font-semibold mb-3">
                    Buy now
                  </h2>
                )}
                <DealsNavButton
                  buttonText={
                    userSubscription?.user_info?.subscription_plan ==
                    process.env.NEXT_PUBLIC_ANNUAL_PREMIUM_PLAN
                      ? "Get 3X higher limits with Scale Plan"
                      : deal == "second"
                      ? "Upgrade to Premium Annual Plan"
                      : "View Cyber Monday offer"
                  }
                  deal={deal}
                  handleDealsNavButtonClick={() => {
                    handleDealsNavButtonClick(dispatch);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4">
              <div className="flex justify-end">
                <MdOutlineClose
                  size={18}
                  height={18}
                  width={18}
                  className={`dark:text-[#8a8a8a] cursor-pointer text-[#9e9e9e] h-5 w-5`}
                  onClick={() => {
                    onClose();
                  }}
                />
              </div>
              <div>
                {deal == "second" ? (
                  <div className=" flex items-center gap-2 justify-end">
                    <span className="text-[24px] font-[Inter,sans-serif] font-bold dark:text-white text-[#131314] leading-none">
                      $179
                    </span>
                    <span className="text-[20px] font-[Inter,sans-serif] font-semibold  text-[#757575] dark:text-[#8a8a8a] pt-2 line-through leading-none">
                      $216
                    </span>
                  </div>
                ) : (
                  <h1 className="dark:text-white text-[40px] font-bold line leading-none flex justify-end">
                    -36%
                  </h1>
                )}

                {deal == "second" ? (
                  <span className="text-[12px] font-normal dark:text-[#8a8a8a] text-[#757575]">
                    Discount applicable for 1st year
                  </span>
                ) : (
                  <span className="text-sm font-normal dark:text-[#dedede] text-[#212121]">
                    Limited-time offer
                  </span>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {" "}
            <div>
              <h3 className="text-sm font-semibold dark:text-white text-[#131314] truncate">
                {deal == "second"
                  ? "Premium Annual plan"
                  : "Scale Plan - 1 year Subscription"}
              </h3>
              <p className="text-sm font-normal dark:text-[#dedede] text-[#212121]">
                {deal == "second" ? "Buy now" : " Limited-time offer"}
              </p>
            </div>
            <div className="flex items-center gap-3.5">
              <DealsNavButton
                buttonText={
                  userSubscription?.user_info?.subscription_plan ==
                  process.env.NEXT_PUBLIC_ANNUAL_PREMIUM_PLAN
                    ? "Get 3X higher limits with Scale Plan"
                    : deal == "second"
                    ? "Upgrade to Premium Annual Plan"
                    : "View Cyber Monday offer"
                }
                deal={deal}
                handleDealsNavButtonClick={() => {
                  handleDealsNavButtonClick(dispatch);
                }}
              />

              <MdOutlineClose
                size={18}
                height={18}
                width={18}
                className={`dark:text-[#8a8a8a] cursor-pointer text-[#9e9e9e] h-5 w-5`}
                onClick={() => {
                  onClose();
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BlackFridayDealsBanner;
