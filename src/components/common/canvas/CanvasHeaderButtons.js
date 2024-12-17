import React, { useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { executeCode, setOutput } from "@/redux/reducers/codeEditorReducer";
import PremiumPopup from "../premium/PremiumPopup";
import { showPopup } from "@/redux/reducers/commonReducer";
import {
  hasActivePremiumSubscription,
  hasActiveTrialSubscription,
  isCanceledPremium,
} from "@/utils/subscription";
import LoginForm from "../login/LoginForm";
import Icon from "../Icon";

const CanvasHeaderButtons = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const userSubscription = useSelector((state) => state.userSubscription);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const { code, language, loading, output } = useSelector(
    (state) => state.code
  );
  const dispatch = useDispatch();

  const handleRunClick = () => {
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

    if (
      !hasActivePremiumSubscription(userSubscription) &&
      !hasActiveTrialSubscription(userSubscription) &&
      userSubscription?.run_count <= 0 &&
      !userSubscription?.sumo_data
    ) {
      dispatch(
        showPopup({
          title: "",
          description: <PremiumPopup isCodeGenerator={true} />,
          btnArray: [],
          classAdditions: {
            popupContainer: "w-full md:w-[28%] h-[90%] md:h-auto rounded-t-2xl",
            popup: "h-screen !rounded-none w-full md:h-auto md:!rounded-lg",
            additional: "fixed md:relative bottom-0",
          },
        })
      );
    } else {
      dispatch(
        executeCode({ code, language, stdin: "", userId: currentUser?.uid })
      );
    }
  };

  const isURL = (str) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(str);
  };

  const handlePreview = () => {
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

    if (
      !hasActivePremiumSubscription(userSubscription) &&
      !hasActiveTrialSubscription(userSubscription) &&
      !userSubscription?.sumo_data
    ) {
      dispatch(
        showPopup({
          title: "",
          description: <PremiumPopup isCodeGenerator={true} />,
          btnArray: [],
          classAdditions: {
            popupContainer: "w-full md:w-[28%] h-[90%] md:h-auto rounded-t-2xl",
            popup: "h-screen !rounded-none w-full md:h-auto md:!rounded-lg",
            additional: "fixed md:relative bottom-0",
          },
        })
      );
    } else {
      if (output?.stdout && isURL(output?.stdout)) {
        window.open(output?.stdout, "_blank");
      }
    }
  };

  const isPreviewDisabled = !isURL(output.stdout);

  return (
    <div className="flex justify-between items-center p-3">
      <div className="flex space-x-4">
        {/* <div
          className={`rounded-lg header-button bg-white flex items-center justify-center py-2 px-4 dark:bg-darkBotPrimary text-label dark:text-white`}
        >
          <Image
            src={`/svgs/${
              darkMode ? "connectSystem" : "connectSystemLight"
            }.svg`}
            alt={`connect`}
            width={18}
            height={18}
            className={`block mr-2`}
          />
          <p className="font-medium text-sm" style={{ whiteSpace: "nowrap" }}>
            Connect your system
          </p>
        </div> */}
      </div>
      <div className="flex space-x-1">
        <div
          className={`rounded-lg flex items-center justify-center py-2 px-4 dark:bg-darkBotPrimary text-label dark:text-white ${
            isPreviewDisabled ? " cursor-not-allowed" : ""
          }`}
          onClick={!isPreviewDisabled ? handlePreview : null}
        >
          <Image
            src={`/svgs/${darkMode ? "preview" : "previewLight"}.svg`}
            alt={`preview`}
            width={18}
            height={18}
            className={`block mr-2`}
          />
          <p className="font-medium text-sm" style={{ whiteSpace: "nowrap" }}>
            Preview
          </p>
        </div>
        {/* <div
          className={`rounded-lg header-button bg-white flex items-center justify-center py-2 px-4 dark:bg-darkBotPrimary text-label dark:text-white`}
        >
          <Image
            src={`/svgs/${darkMode ? "deploy" : "deployLight"}.svg`}
            alt={`deploy`}
            width={18}
            height={18}
            className={`block mr-2`}
          />
          <p className="font-medium text-sm" style={{ whiteSpace: "nowrap" }}>
            Deploy
          </p>
        </div> */}
        <div
          className={`rounded-lg header-button flex items-center justify-center py-2 px-4 pl-3 dark:bg-[#034A10] bg-[#745FFB0D] text-white ${
            loading || !code ? "opacity-95 cursor-not-allowed" : ""
          }`}
          onClick={!loading && code ? handleRunClick : null}
        >
          {loading ? (
            <div className="loader mr-1"></div>
          ) : (
            // <Image
            //   src={`/svgs/run.svg`}
            //   alt={`run`}
            //   width={18}
            //   height={18}
            //   className={`block mr-2`}
            // />
            <Icon
              type={"run"}
              fill={darkMode ? "#FFFFFF" : "#745FFB"}
              className="block mr-2"
              width={18}
              height={18}
            />
          )}
          <p
            className="font-medium text-sm text-[#745FFB] dark:text-white"
            style={{ whiteSpace: "nowrap" }}
          >
            Run
          </p>
        </div>
      </div>
      <style>
        {`
          .header-button {
            box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.06);
          }

          .loader {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #034A10;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 2s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          `}
      </style>
    </div>
  );
};

export default CanvasHeaderButtons;
