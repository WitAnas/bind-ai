import React, { useEffect, useState } from "react";
import AddKeyForm from "./AddKeyForm";
import { MdOutlineClose } from "react-icons/md";
import {
  hidePopup,
  showPopup,
  showToaster,
} from "@/redux/reducers/commonReducer";
import { useDispatch, useSelector } from "react-redux";
import WithoutKeyContinuePopup from "./WithoutKeyContinuePopup";
import { deleteUserApiKey } from "@/redux/reducers/apiKeyReducer";
import { FaArrowRight } from "react-icons/fa";
import { handleClick } from "@/features/chat/components/MessageContainer";
import { useClientMediaQuery } from "@/features/hooks";

const ApiKeyPopup = () => {
  const [hasInputValues, setHasInputValues] = useState(false);
  const [hasOneKey, setHasOnekey] = useState(false);
  const [openForm, setOpenForm] = useState("claude");
  const userKeysData = useSelector((state) => state.apiKeys?.api_keys);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [claudeKeyData, setClaudeKeyData] = useState(null);
  const [openAIKeyData, setOpenAIKeyData] = useState(null);
  const isMobile = useClientMediaQuery("(max-width: 600px)");

  const dispatch = useDispatch();

  useEffect(() => {
    const isEmpty = Object.keys(userKeysData).length === 0;
    if (!isEmpty) {
      setClaudeKeyData(userKeysData["Anthropic"]);
      setOpenAIKeyData(userKeysData["OpenAI"]);

      if (userKeysData["Anthropic"] || userKeysData["OpenAI"]) {
        setHasOnekey(true);
      } else {
        setHasOnekey(false);
      }
    }
  }, [userKeysData]);

  const handleInputChange = (hasValue) => {
    setHasInputValues(hasValue);
  };

  const handleToggle = (formName, isOpen) => {
    setOpenForm(isOpen ? formName : null);
  };

  const handleContinueClick = () => {
    handleClick(dispatch, "All", "all");
    // dispatch(hidePopup());
  };

  const handleWithoutKeyContinueClick = () => {
    dispatch(
      showPopup({
        title: "",
        description: <WithoutKeyContinuePopup />,
        btnArray: [],
        classAdditions: {
          popupContainer: `
         w-[720px] 
        `,
          popup:
            " !w-full !border dark:border-[#ffffff1e] dark:bg-[#26282c] p-7",
        },
      })
    );
  };

  const handleDeleteKey = async (providerName) => {
    try {
      await dispatch(
        deleteUserApiKey({ userId: currentUser?.uid, providerName })
      ).unwrap();

      if (providerName === "Anthropic") {
        setClaudeKeyData(null);
      } else if (providerName === "OpenAI") {
        setOpenAIKeyData(null);
      }
      setHasInputValues(false);
      dispatch(
        showToaster({
          variant: "success",
          title: `Your ${providerName} API key has been successfully deleted.`,
          description: ``,
        })
      );
      setOpenForm("");
    } catch (error) {
      console.error("Failed to delete API key:", error);
      dispatch(
        showToaster({
          variant: "error",
          title: `Failed to delete ${providerName} API key. Please try again later.`,
          description: ``,
        })
      );
    }
  };

  return (
    <div>
      <MdOutlineClose
        size={22}
        className={`dark:text-[#ffffff8a] text-primary  ${
          isMobile
            ? "right-[10px] top-[10px] fixed"
            : "absolute right-[-10px] top-[-10px]"
        }`}
        onClick={() => dispatch(hidePopup())}
      />
      <div className="flex flex-col gap-2 cursor-auto">
        <h1 className="text-2xl font-[Inter,sans-serif] font-semibold dark:text-white text-primary">
          Would you like to add your API keys?
        </h1>
        <p className="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-primary">
          Your own API keys give you unlimited queries with no daily or hourly
          limits for Claude (e.g 3.5 Sonnet) and GPT (e.g 4o) models. This is
          ideal if you extensively use models for tasks such as coding or
          writing. When you press continue, your API keys will be used for
          running queries, you can monitor usage in Anthropic or OpenAI console.
        </p>
        {/* <p
          className="text-sm font-[Inter,sans-serif] font-normal dark:text-white underline text-primary cursor-pointer"
          style={{ textUnderlineOffset: "3px" }}
        >
          Manage your API keys
        </p> */}
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <AddKeyForm
          title="Claude API Key"
          description={
            <>
              Claude provides AI models for natural language understanding and
              generation. Visit the{" "}
              <span
                className="underline cursor-pointer"
                style={{ textUnderlineOffset: "3px" }}
                onClick={() =>
                  window.open(
                    `https://console.anthropic.com/settings/keys`,
                    "_blank"
                  )
                }
              >
                API keys page
              </span>{" "}
              in your Claude account, generate a new key, and paste it below.
            </>
          }
          imageUrl="claude-icon"
          onInputChange={handleInputChange}
          isOpen={openForm === "claude"}
          onToggle={(isOpen) => handleToggle("claude", isOpen)}
          existingKeyData={claudeKeyData}
          onDelete={(providerName) => handleDeleteKey(providerName)}
        />
        <AddKeyForm
          title="OpenAI API Key"
          description={
            <>
              To get started, you&apos;ll need an API key from OpenAI. Visit the{" "}
              <span
                className="underline cursor-pointer"
                style={{ textUnderlineOffset: "3px" }}
                onClick={() =>
                  window.open(
                    `https://platform.openai.com/settings/profile?tab=api-keys`,
                    "_blank"
                  )
                }
              >
                API keys page
              </span>{" "}
              in your OpenAI account, generate a new key, and paste it below.
            </>
          }
          imageUrl="openai-icon"
          onInputChange={handleInputChange}
          isOpen={openForm === "openai"}
          onToggle={(isOpen) => handleToggle("openai", isOpen)}
          existingKeyData={openAIKeyData}
          onDelete={(providerName) => handleDeleteKey(providerName)}
        />
      </div>
      {hasOneKey ? (
        <button
          className={`text-base font-[Inter,sans-serif] font-medium mt-6 float-end dark:text-white cursor-pointer  text-primary flex items-center gap-3`}
          onClick={handleContinueClick}
        >
          <span className="underline" style={{ textUnderlineOffset: "3px" }}>
            Continue
          </span>
          <FaArrowRight size={18} className={`dark:text-white`} />
        </button>
      ) : (
        <button
          className={`text-base font-[Inter,sans-serif] font-medium mt-6 float-end ${
            hasInputValues
              ? "dark:text-[#ffffff61] cursor-default"
              : "dark:text-white87 cursor-pointer"
          }  text-primary`}
          disabled={hasInputValues}
          onClick={handleWithoutKeyContinueClick}
        >
          Continue without adding API keys
        </button>
      )}
    </div>
  );
};

export default ApiKeyPopup;
