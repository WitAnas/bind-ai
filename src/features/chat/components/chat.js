"use client";

import BotsData from "@/constants/bots";
import WebBot from "./WebBot";
import WebBotHome from "./WebBotHome";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { marked } from "marked";
import RightSideBar from "@/components/common/RightSidebar";
import { useClientMediaQuery } from "@/features/hooks";
import CanvasHeaderButtons from "@/components/common/canvas/CanvasHeaderButtons";
import CanvasTabs from "@/components/common/canvas/CanvasTabs";
import CanvasTabContent from "@/components/common/canvas/CanvasTabContent";
import CanvasCodeOutput from "@/components/common/canvas/CanvasCodeOutput";
import { useDispatch, useSelector } from "react-redux";
import CanvasTextEditor from "@/components/common/canvas/CanvasTextEditor";

import CreateGptAgent from "@/components/common/canvas/CreateGptAgent";
import ProjectThread from "@/components/common/thread/ProjectThread";
import Threads from "@/components/common/thread/Threads";
import {
  fetchSessionList,
  setCurrentSessionId,
} from "@/redux/reducers/sessionReducer";
import TestChatBot from "./TestChatBot";
import GptAgents from "@/components/common/canvas/GptAgents";
import {
  setCanvasOpen,
  setCodeEditor,
} from "@/redux/reducers/codeEditorReducer";

const Chat = ({ botId }) => {
  const [currentTab, setCurrentTab] = useState("CODE");
  const [webbotWidth, setWebbotWidth] = useState(75);
  const dynamicText = useSelector((state) => state.code.dynamicText);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const loading = useSelector((state) => state.auth.loading);
  const userSubscription = useSelector((state) => state.userSubscription);

  const { code, language, codeEditor, documentEditor, gptAgent, canvasOpen } =
    useSelector((state) => state.code);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const threadBarOpen = useSelector((state) => state.common.threadBarOpen);
  const isMobile = useClientMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();

  const defaultBots = BotsData();
  const bot = defaultBots.find((b) => b.botId === botId || b.route === botId);

  const botID = bot ? bot.botId : botId;
  const botName = bot && bot.name;

  const handleMouseDown = useCallback((e) => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 55 && newWidth < 75) {
      setWebbotWidth(newWidth);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    if (botName == "Code Generator") {
      dispatch(setCodeEditor(true));
    }
  }, [botName]);

  useEffect(() => {
    if (!userSubscription.loading && !loading) {
      if (currentUser.uid) {
        dispatch(
          fetchSessionList({
            userId: currentUser?.uid,
            botId: botId ? botID : "661cacc79657814effd8db6c",
          })
        );
      }
    }
  }, [botID, currentUser.uid, userSubscription.loading, loading]);

  const handleDynamicTextChange = (markdownText) => {
    const htmlText = marked(markdownText);
    return htmlText;
  };

  const renderCanvasContent = () => (
    <div className="">
      <CanvasHeaderButtons />
      <CanvasTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <CanvasTabContent currentTab={currentTab} />
      <CanvasCodeOutput />
    </div>
  );

  return (
    <>
      <div className="flex justify-between h-full relative">
        <div
          className={`w-full overflow-y-hidden overflow-x-hidden relative bg-[#fafafa] dark:bg-darkChatBox border  dark:border-[#ffffff1e] dark:border-r-[#ffffff23]  border-lightBorder ${
            canvasOpen ? "main-div-width main-div" : "main-div-full"
          }`}
        >
          {botId ? (
            <div className="flex w-full">
              {!isMobile &&
                (botID == "660f2def795718a92af22fc1" ? (
                  <div
                    className={` dark:bg-darkProject bg-lightProject  ${
                      threadBarOpen
                        ? "min-w-[265px] max-w-[265px]"
                        : "min-w-[55px] max-w-[55px]"
                    } border-r dark:border-r-[#ffffff23] md:block hidden`}
                  >
                    <Threads botId={botID} />
                  </div>
                ) : (
                  <div
                    className={` dark:bg-darkProject bg-lightProject  ${
                      threadBarOpen
                        ? "min-w-[265px] max-w-[265px]"
                        : "min-w-[55px] max-w-[55px]"
                    } border-r dark:border-r-[#ffffff23] md:block hidden`}
                  >
                    <Threads botId={botID} />
                  </div>
                ))}
              <div
                className={`relative ${
                  !isMobile
                    ? threadBarOpen
                      ? "w-[calc(100%-265px)]"
                      : "w-[calc(100%-55px)]"
                    : "w-full"
                }`}
              >
                {botID == "664aaf841bccad5bb77c96ab" ? (
                  <TestChatBot botId={botID} botName={botName} />
                ) : (
                  <WebBot botId={botID} botName={botName} />
                )}
              </div>
            </div>
          ) : (
            <WebBotHome botId={defaultBots.find((b) => b.id == 1)?.route} />
          )}
        </div>
        {canvasOpen && !isMobile && (
          <div
            onMouseDown={handleMouseDown}
            className="w-0.5 cursor-ew-resize bg-primary dark:hover:bg-[#745FFB] dark:bg-darkPrimary noselect"
          ></div>
        )}

        {!isMobile && (
          <div
            className={`bg-[#fafafa] overflow-y-hidden dark:bg-darkCanvas cursor-pointer canvas hidden md:block flex-1 ${
              canvasOpen
                ? "canvas-open border dark:border-darkPrimary  border-lightBorder"
                : "w-0"
            }`}
          >
            {canvasOpen && (
              <>
                {codeEditor ? (
                  renderCanvasContent()
                ) : documentEditor ? (
                  <CanvasTextEditor
                    handleDynamicTextChange={handleDynamicTextChange}
                  />
                ) : gptAgent ? (
                  <GptAgents />
                ) : code && language ? (
                  renderCanvasContent()
                ) : dynamicText ? (
                  <CanvasTextEditor
                    handleDynamicTextChange={handleDynamicTextChange}
                  />
                ) : botName == "Code Generator" ? (
                  renderCanvasContent()
                ) : (
                  <CanvasTextEditor
                    handleDynamicTextChange={handleDynamicTextChange}
                  />
                )}
              </>
            )}
          </div>
        )}
        {!isMobile && <RightSideBar />}
      </div>

      {threadBarOpen && isMobile && (
        <div className="sm:block md:hidden">
          <div className="absolute top-0 bg-primary dark:bg-darkPrimary h-screen  w-screen overflow-hidden z-20">
            <Threads botId={botId ? botID : "661cacc79657814effd8db6c"} />
          </div>
        </div>
      )}
      <style>
        {`
          .main-div {
            border-radius: 20px 0px 0px 0px;
          }
          .main-div-full {
            border-radius: 20px 20px 0px 0px;
          }
          .canvas {
            border-radius: 0px 20px 0px 0px;
          }
          .canvas-open {
            width: 50%;
            max-width: 60%;
            min-width: 40%;
          }
          @media (min-width: 768px) {
            .main-div-width {
              width: ${webbotWidth}%;
              max-width: 75%;
              min-width: 55%;
            }
          }

          .noselect {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          .ql-container {
            background-color: ${darkMode ? "#2A3145" : "white"};
            height: 100vh;
          }

          .ql-editor {
            overflow-y: scroll;
            max-height: calc(100vh - 142px);
          }

          .ql-container.ql-snow {
            border: 0px;
          }

          .ql-toolbar.ql-snow {
            border: 0px;
            height: 50px;
            display: flex;
            align-items: center;
          }

          .dark .ql-snow .ql-picker-label {
            color: white;
          }

          .dark .ql-snow .ql-stroke {
            stroke: white;
          }

          .ql-editor::-webkit-scrollbar {
            width: 8px;
          }

          .ql-editor::-webkit-scrollbar-track {
            background: transparent;
          }

          .ql-editor::-webkit-scrollbar-thumb {
            background: #e4e5ea;
            border-radius: 4px;
          }

          .ql-editor::-webkit-scrollbar-thumb:hover {
            background: #e4e5ea;
          }

          .copy-button {
            box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.06);
          }

          .quill{
          }
        `}
      </style>
    </>
  );
};

export default Chat;
