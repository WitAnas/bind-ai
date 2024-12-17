import ModelCategoryContainer from "@/components/common/chat/ModelCategoryContainer";
import LoginForm from "@/components/common/login/LoginForm";
import { ModelCategory } from "@/features/chat/constants";
import { setLatestModel } from "@/redux/reducers/botReducer";
import {
  setCanvasOpen,
  setCode,
  setCodeEditor,
  setDocumentEditor,
  setDynamicText,
  setLanguage,
} from "@/redux/reducers/codeEditorReducer";
import { showPopup, showToaster } from "@/redux/reducers/commonReducer";
import axios from "axios";

// Prepare form data for API call
export const prepareFormData = ({
  botId,
  sessionKey,
  inputText,
  botData,
  currentUser,
  contextSearch,
}) => {
  const formData = new FormData();
  formData.append("botId", botId);
  formData.append("sessionKey", sessionKey);
  formData.append("inputText", inputText);
  formData.append(
    "modelName",
    botData?.model?.value ||
      (botId === "660f2def795718a92af22fc1"
        ? "codestral-latest"
        : "gpt-4o-mini")
  );

  if (currentUser?.uid) {
    formData.append("userId", currentUser.uid);
  }

  if (contextSearch) {
    formData.append("embeddings", JSON.stringify(contextSearch));
  }

  return formData;
};

// Helper function to get API endpoint
export const getApiEndpoint = (botName) => {
  const baseUrl = process.env.NEXT_PUBLIC_NEW_BACKEND_URL;
  switch (botName) {
    case "Bind Pro":
      return `${baseUrl}/search`;
    case "Web Search":
      return `${baseUrl}/websearch`;
    default:
      return `${baseUrl}/stream`;
  }
};

// Helper function to handle errors
export const handleError = (
  msg,
  updateHistory,
  setStatus,
  setApiError,
  setFailedRequest
) => {
  console.log("Error in chat operation");
  setApiError(true);
  setFailedRequest({ msg });
  setStatus(0);
  updateHistory((prevHistory) => {
    const newHistory = [...prevHistory];
    newHistory.pop();
    return newHistory;
  });
};

export const parseCode = (code) => {
  if (!code) return { language: "javascript", content: "" };

  const lines = code?.split("\n");
  const language = lines[0]?.trim()?.toLowerCase() || "javascript";
  const content = lines?.slice(1).join("\n");

  return { language, content };
};

export const isCodePartPresent = (response) => {
  const regex = /```([\s\S]+?)```/;
  const match = response?.match(regex);

  if (match) {
    const codePart = match[1].trim();
    return codePart;
  } else {
    return false;
  }
};

export const handleSubDescClick = (url) => {
  window.open(url, "_blank");
};

export const getBotData = (botId) => {
  const botData = localStorage.getItem(botId);

  return botData ? JSON.parse(botData) : {};
};

export const handleTextClick = (
  category,
  switchs,
  dispatch,
  handleModelChange
) => {
  if (switchs) {
    const botData = getBotData(botId);
    const gpt3_5Model = ModelCategory.find(
      (obj) => obj.value == "general_purpose"
    )?.botList.find((bot) => bot.value == "gpt-3.5-turbo");

    botData.model = gpt3_5Model;
    localStorage.setItem(botId, JSON.stringify(botData));

    // setLatestModel(gpt3_5Model);
    dispatch(setLatestModel(gpt3_5Model));
  }
  dispatch(
    showPopup({
      title: "",
      description: (
        <ModelCategoryContainer
          onModelChange={handleModelChange}
          category={category}
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

export const handleEditorOpen = (content, dispatch) => {
  const codeStartIndex = content.indexOf("```");

  if (codeStartIndex !== -1) {
    const codeEndIndex = content.lastIndexOf("```");
    const codePart = content.slice(codeStartIndex + 3, codeEndIndex).trim();

    if (codePart) {
      const { language, content: parsedContent } = parseCode(codePart);

      if (parsedContent && language) {
        dispatch(setCode(parsedContent));
        dispatch(setLanguage(language));
        dispatch(setDynamicText(""));
        dispatch(setCodeEditor(true));
      }
    }
  } else {
    dispatch(setDynamicText(content));
    dispatch(setLanguage(""));
    dispatch(setCode(""));
    dispatch(setDocumentEditor(true));
  }
};
