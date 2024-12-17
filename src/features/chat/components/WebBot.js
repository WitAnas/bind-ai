"use client";
import { useState, useRef, useEffect, useTransition, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hidePopup, showPopup } from "@/redux/reducers/commonReducer.js";
import {
  setCurrentBotId,
  setLatestModel,
} from "@/redux/reducers/botReducer.js";
import BotsData from "@/constants/bots.js";
import BotContainer from "@/components/common/BotContainer.js";
import ModelSelectButton from "./ModelSelectButton.js";
import {
  hasActivePremiumSubscription,
  hasActiveTrialSubscription,
} from "@/utils/subscription/index.js";
import { usePathname, useRouter, useSearchParams } from "next/navigation.js";
import ModelCategoryContainer from "@/components/common/chat/ModelCategoryContainer.js";
import { removeQueryParam } from "@/utils/index.js";
import FreeTierPopup from "@/components/common/premium/FreetierPopup.js";
import { useClientMediaQuery } from "@/features/hooks/index.js";
import MessageListView from "./MessageListView.js";
import { getBotData, handleTextClick } from "@/utils/chat/index.js";

const WebBot = ({ botId, botName }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const isMobile = useClientMediaQuery("(max-width: 600px)");
  const userSubscription = useSelector((state) => state.userSubscription);
  const canvasOpen = useSelector((state) => state.code.canvasOpen);
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(setCurrentBotId(botId));
  }, [botId]);

  useEffect(() => {
    if (!userSubscription.loading && !loading) {
      const modelCategory = params.get("model");
      const categoryMapping = {
        all: {
          name: "All",
          value: "all",
        },
        advanced: {
          name: "Advanced Models",
          value: "advanced_models",
        },
        "Fast General Purpose": {
          name: "Fast General Purpose",
          value: "general_purpose",
        },
        "Long Context Window": {
          name: "Long Context Window",
          value: "context_window",
        },
      };

      const mappedCategory = categoryMapping[modelCategory];

      if (mappedCategory && modelCategory) {
        if (currentUser?.uid) {
          removeQueryParam("model", router, params, pathname);
        }
        dispatch(
          showPopup({
            title: "",
            description: (
              <ModelCategoryContainer
                onModelChange={handleModelChange}
                category={mappedCategory}
              />
            ),
            btnArray: [],
            classAdditions: {
              popupContainer: "w-full md:w-1/4",
              popup: "h-screen !rounded-none w-full md:h-auto md:!rounded-lg",
            },
          })
        );
      } else {
        if (
          botName == "Code Generator" &&
          !hasActivePremiumSubscription(userSubscription) &&
          !hasActiveTrialSubscription(userSubscription)
        ) {
          dispatch(
            showPopup({
              title: "",
              description: (
                <FreeTierPopup
                  heading="Advanced Code Generation with GPT-4o and Claude Opus"
                  icon="web-search1"
                  desc="Select advanced models, compile and execute the code."
                  buttonText="Choose a Model"
                  text="Learn more"
                  handleClick={() => {
                    handleTextClick(
                      {
                        name: "All",
                        value: "all",
                      },
                      false,
                      dispatch,
                      handleModelChange
                    );
                  }}
                  handleTextClick={() => {
                    window.open(
                      "https://www.getbind.co/#code-generation",
                      "_blank"
                    );
                  }}
                />
              ),
              btnArray: [],
              classAdditions: {
                popupContainer: "md:w-[30%] w-11/12",
              },
            })
          );
        } else if (
          botName == "Web Search" &&
          !hasActivePremiumSubscription(userSubscription) &&
          !hasActiveTrialSubscription(userSubscription)
        ) {
          dispatch(
            showPopup({
              title: "",
              description: (
                <FreeTierPopup
                  heading="AI-powered Web Search"
                  icon="web-search"
                  desc="Get real-time, factual information from multiple sources. Research the web to get the best out of Bind AI"
                  buttonText="Start Searching"
                  text="Try Search with Premium Models"
                  handleClick={() => {
                    dispatch(hidePopup());
                  }}
                  handleTextClick={() => {
                    handleTextClick(
                      {
                        name: "Advanced Models",
                        value: "advanced_models",
                      },
                      false,
                      dispatch,
                      handleModelChange
                    );
                    // window.open("https://www.getbind.co/#web-search", "_blank");
                  }}
                />
              ),
              btnArray: [],
              classAdditions: {
                popupContainer: "md:w-[30%] w-11/12",
              },
            })
          );
        }
      }
    }
  }, [userSubscription.loading, loading]);

  const handleModelChange = (newModel) => {
    const botData = getBotData(botId);
    botData.model = newModel;
    localStorage.setItem(botId, JSON.stringify(botData));

    // setLatestModel(newModel);
    dispatch(setLatestModel(newModel));
  };

  return (
    <div className="md:pl-4">
      <div
        className={` ${
          canvasOpen ? "w-11/12" : isMobile ? "w-[95%]" : "max-w-[980px]"
        } mx-auto py-2 my-2 overflow-x-scroll bot-container`}
      >
        <BotContainer bots={BotsData()} botId={botId} />
      </div>

      <ModelSelectButton
        // model={latestModel}
        onModelChange={handleModelChange}
        botId={botId}
        // setLatestModel={setLatestModel}
        getBotData={getBotData}
      />

      <div className="chat relative h-[calc(100vh-142px)]">
        <div
          className={`flex h-[calc(100vh-142px)] ${
            canvasOpen ? "w-11/12" : isMobile ? "w-[95%]" : "max-w-[980px]"
          } mx-auto`}
        >
          <MessageListView botId={botId} botName={botName} />
        </div>
        <style>
          {`
            .chatbot-production-send-text-active {
              color: var(--main-1-c-274-c, #1c274c);
              font-family: Inter;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
            }

            .chatbot-production-send-text-inactive {
              color: var(--main-54848-a-9-e, #848a9e);
              font-family: Inter;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
            }
            .chat {
              border-radius: 16px 0px 0px 0px;
            }

            .scrollable-element {
              /* WebKit-based browsers */
              overflow: auto;
            }

            .scrollable-element::-webkit-scrollbar {
              display: none;
            }

            /* Firefox browsers */
            .scrollable-element {
              scrollbar-width: none;
            }

            .bot-container::-webkit-scrollbar {
              width: 8px;
              height: 5px;
            }

            .bot-container::-webkit-scrollbar-track {
              background: transparent;
            }

            .bot-container::-webkit-scrollbar-thumb {
              background: #e4e5ea;
              border-radius: 8px;
            }

            .bot-container::-webkit-scrollbar-thumb:hover {
              background: #e4e5ea;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default WebBot;
