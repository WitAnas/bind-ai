import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import MessageContainer from "./MessageContainer";
import { useDispatch, useSelector } from "react-redux";
import { showPopup, showToaster } from "@/redux/reducers/commonReducer";
import LoginForm from "@/components/common/login/LoginForm";
import {
  getApiEndpoint,
  getBotData,
  handleError,
  handleSubDescClick,
  handleTextClick,
  isCodePartPresent,
  parseCode,
  prepareFormData,
} from "@/utils/chat";
import { callSearchAPI, getBannerProps, removeQueryParam } from "@/utils";
import {
  decrementBotQueryCount,
  decrementQueryCount,
  incrementTotalQueriesThisMonth,
  modifybotQueryCount,
} from "@/redux/reducers/userSubscriptionReducer";
import {
  hasActivePremiumSubscription,
  hasActiveTrialSubscription,
} from "@/utils/subscription";
import FreeTierPopup from "@/components/common/premium/FreetierPopup";
import { handlePayment } from "@/features/onboarding/components/SubscriptionStep";
import { clearBotMessage, setLatestModel } from "@/redux/reducers/botReducer";
import SumoUsersLimitPopup from "@/features/sumo-app/components/SumoUsersLimitPopup";
import PremiumPopup from "@/components/common/premium/PremiumPopup";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setCurrentSessionId } from "@/redux/reducers/sessionReducer";
import { ModelCategory } from "../constants";
import {
  setCode,
  setCodeEditor,
  setDynamicText,
  setLanguage,
} from "@/redux/reducers/codeEditorReducer";
import MessageList from "./MessageList";
import { ChatSkeleton } from "@/components/ui/LoadingSkeleton";
import axios from "axios";
import BlackFridayDealsBanner from "@/components/common/deals/BlackFridayDealsBanner";
import { setShowBanner } from "@/redux/reducers/dealsReducer";

const MessageListView = React.memo(({ botId, botName }) => {
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState(0);
  const [queryCount, setQueryCount] = useState(0);
  const [popupShown, setPopupShown] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [typingEffectIndex, setTypingEffectIndex] = useState(null);
  const [shouldStopTyping, setShouldStopTyping] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [failedRequest, setFailedRequest] = useState(null);
  const [typingComplete, setTypingComplete] = useState(false);
  // const [showBanner, setShowBanner] = useState(true);

  // redux states
  const currentUser = useSelector((state) => state.auth.currentUser);
  const showBanner = useSelector((state) => state.deals.showBanner);
  const initialBotMessage = useSelector((state) => state.bot.initialBotMessage);
  const userSubscription = useSelector((state) => state.userSubscription);
  const queryCounts = useSelector(
    (state) => state.userSubscription.user_info?.query_counts
  );
  const free_limit = useSelector(
    (state) => state.userSubscription.user_info?.free_limit
  );
  const loading = useSelector((state) => state.auth.loading);
  const { toggledState } = useSelector((state) => state.sessions);

  // ref
  const abortControllerRef = useRef(null);
  const accumulatedDataRef = useRef("");

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const closeBanner = useCallback(() => {
    dispatch(setShowBanner(false));
  }, []);

  const handleSubmit = async (msg, setMsg) => {
    if (!currentUser.uid && history.length >= 20 && !popupShown) {
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
      dispatch(setShowBanner(true));
      setPopupShown(true);
      setQueryCount(0);
    } else if (!currentUser.uid && queryCount >= 6 && popupShown) {
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

      dispatch(setShowBanner(true));
      setQueryCount(0);
    } else {
      if (msg != "") {
        if (status == 1) {
          dispatch(
            showToaster({
              variant: "error",
              title: "Bot is thinking...",
              description: "",
            })
          );
        } else {
          let botData = getBotData(botId);
          if (!botData.sessionKey) {
            botData.sessionKey = Math.random().toString(36).substring(2, 15);
            localStorage.setItem(botId, JSON.stringify(botData));
          }

          botData = getBotData(botId);

          if (checkConditions()) {
            dispatch(setShowBanner(false));
            setMsg("");
            setStatus(1);
            updateHistory((prevHistory) => [
              ...prevHistory,
              { type: "human", content: msg },
              { type: "loading" },
            ]);

            const apiEndpoint = getApiEndpoint(botName);
            const contextSearch = currentUser?.uid
              ? await callSearchAPI(msg, 2, currentUser?.uid)
              : null;

            const formData = prepareFormData({
              botId,
              sessionKey: botData?.sessionKey,
              inputText: msg,
              botData,
              currentUser,
              contextSearch,
            });

            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;

            try {
              const response = await fetch(apiEndpoint, {
                method: "POST",
                body: formData,
                headers: { Accept: "text/event-stream" },
                signal,
              });

              if (response?.status == 200 || response?.ok == true) {
                if (!currentUser.uid) {
                  setQueryCount(queryCount + 2);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                accumulatedDataRef.current = "";

                updateHistory((prevHistory) => {
                  const newHistory = [...prevHistory];
                  newHistory.pop();
                  newHistory.push({ type: "AIMessage", content: "" });
                  return newHistory;
                });

                setTypingEffectIndex(history.length - 1);
                setShouldStopTyping(false);
                setTypingComplete(false);
                decrementQueryCountFn(botData?.model?.value);

                if (userSubscription?.sumo_data) {
                  dispatch(incrementTotalQueriesThisMonth());
                }

                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  const chunk = decoder.decode(value);

                  accumulatedDataRef.current += chunk;

                  updateHistory((prevHistory) => {
                    const newHistory = [...prevHistory];
                    if (newHistory.length > 0) {
                      newHistory[newHistory.length - 1].content =
                        accumulatedDataRef.current;
                    }
                    return newHistory;
                  });
                }

                setShouldStopTyping(true);
                setTypingComplete(true);
                setStatus(0);
                setApiError(false);
              } else {
                handleError(
                  msg,
                  updateHistory,
                  setStatus,
                  setApiError,
                  setFailedRequest
                );
              }
            } catch (error) {
              console.log("Error sending message:", error);

              if (error.name === "AbortError") {
                console.log("Streaming aborted by user.");
                setStatus(0);
              } else {
                handleError(
                  msg,
                  updateHistory,
                  setStatus,
                  setApiError,
                  setFailedRequest
                );
              }
            }
          }
        }
      }
    }
  };

  const fetchChatHistory = async (sessionKey) => {
    try {
      setIsHistoryLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEW_BACKEND_URL}/chatHistory?session=${sessionKey}`
      );
      return res?.data?.msg || [];
    } catch (error) {
      console.log("History API error:", error);
      return [];
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const startChat = async () => {
    const botData = getBotData(botId);

    try {
      const previousMessages = await fetchChatHistory(botData?.sessionKey);
      updateHistory((prevHistory) => [...previousMessages]);

      const query = params.get("query");
      const messageToSend = initialBotMessage || query;

      if (messageToSend) {
        if (initialBotMessage) {
          dispatch(clearBotMessage());
        } else if (query) {
          removeQueryParam("query", router, params, pathname);
        }
        if (checkConditions()) {
          await handleSubmit(messageToSend, () => {});
        }
      }
    } catch (error) {
      console.log("Chat initialization error:", error);
    }
  };

  const handleRetry = async () => {
    if (!failedRequest || !apiError) {
      return;
    }

    setApiError(false);
    const { msg } = failedRequest;

    updateHistory((prevHistory) => [...prevHistory, { type: "loading" }]);

    const botData = getBotData(botId);
    const apiEndpoint = getApiEndpoint(botName);

    const formData = prepareFormData({
      botId,
      sessionKey: botData.sessionKey,
      inputText: msg,
      botData,
      currentUser,
    });

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      setStatus(1);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "text/event-stream" },
        signal,
      });

      if (response?.status == 200 || response?.ok == true) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        accumulatedDataRef.current = "";

        updateHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          newHistory.pop();
          newHistory.push({ type: "AIMessage", content: "" });
          return newHistory;
        });
        setTypingEffectIndex(history.length - 1);

        setShouldStopTyping(false);
        setTypingComplete(false);
        decrementQueryCountFn(botData?.model?.value);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);

          accumulatedDataRef.current += chunk;

          updateHistory((prevHistory) => {
            const newHistory = [...prevHistory];
            if (newHistory.length > 0) {
              newHistory[newHistory.length - 1].content =
                accumulatedDataRef.current;
            }
            return newHistory;
          });
        }

        setStatus(0);
        setShouldStopTyping(true);
        setTypingComplete(true);
      } else {
        handleError(
          msg,
          updateHistory,
          setStatus,
          setApiError,
          setFailedRequest
        );
      }
    } catch (error) {
      console.log("Error sending message:", error);

      if (error.name === "AbortError") {
        setStatus(0);
        console.log("Streaming aborted by user.");
      } else {
        handleError(
          msg,
          updateHistory,
          setStatus,
          setApiError,
          setFailedRequest
        );
      }
    }
  };

  const handleModelChange = (newModel) => {
    const botData = getBotData(botId);
    botData.model = newModel;
    localStorage.setItem(botId, JSON.stringify(botData));

    // setLatestModel(newModel);
    dispatch(setLatestModel(newModel));
  };

  const checkConditions = () => {
    const botData = getBotData(botId);

    // Condition 1: GPT-4-Omni and user doesn't have premium/trial or is over query limit
    if (
      currentUser.uid &&
      botData.model?.value === "gpt-4-omni" &&
      history.length >= 10 &&
      !hasActivePremiumSubscription(userSubscription) &&
      !hasActiveTrialSubscription(userSubscription) &&
      !userSubscription?.sumo_data
    ) {
      dispatch(
        showPopup({
          title: "",
          description: (
            <FreeTierPopup
              heading="Need More Queries?"
              icon="bind1"
              icon2="claude"
              desc="Unlock 10X higher query limit and access advanced AI models such as"
              subDesc="Claude 3.5 Sonnet, GPT-4o."
              buttonText="$0 for 7 days "
              text="Switch to Basic Models"
              handleSubDescClick={() => {
                handleSubDescClick(
                  "https://blog.getbind.co/2024/06/21/claude-3-5-sonnet-does-it-outperform-gpt-4o/"
                );
              }}
              handleClick={() => {
                handlePayment(currentUser, dispatch);
              }}
              handleTextClick={() => {
                handleTextClick(
                  {
                    name: "Fast General Purpose",
                    value: "general_purpose",
                  },
                  false,
                  dispatch,
                  handleModelChange
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
      return false;
    }

    // Condition 2: Sumo users are over the allowed queries for the month
    if (
      userSubscription?.sumo_data &&
      userSubscription?.sumo_data?.features?.allowed_model_queries_per_month
        ?.number_of_queries <=
        userSubscription?.sumo_data?.total_queries_this_month
    ) {
      dispatch(
        showPopup({
          title: "",
          description: (
            <SumoUsersLimitPopup
              feature="query"
              h1={
                userSubscription?.sumo_data
                  ? "You have reached the limit"
                  : "Try 15+ Advanced Models"
              }
              h2={
                userSubscription?.sumo_data
                  ? "for current Tier"
                  : "with Bind AI Premium"
              }
              desc={
                <>
                  Get access to the most advanced AI models for code
                  <br /> generation, technical writing, complex reasoning.
                </>
              }
              features={["OpenAI GPT-4o", "Claude 3.5 Sonnet", "Llama 3.1"]}
              ctaHeading={
                userSubscription?.sumo_data
                  ? "Upgrade to Next Tier"
                  : userSubscription?.user_info?.trial_available === true ||
                    userSubscription?.user_info?.trial_available === "true"
                  ? "Start a 7 day Trial"
                  : "Subscribe Now"
              }
            />
          ),
          btnArray: [],
          classAdditions: {
            popupContainer: "w-[510px]",
            popup:
              "!w-full !border dark:border-[#ffffff1e] dark:bg-[#26282c] px-7",
          },
        })
      );
      return false;
    }

    // Condition 3: Bot-specific query limits and free limits reached
    if (
      (botName === "Web Search" ||
        botName === "Code Generator" ||
        botName === "Bind AI") &&
      free_limit?.[
        botName === "Web Search"
          ? "web_search"
          : botName === "Code Generator"
          ? "code_generator"
          : "bind_ai"
      ]?.remaining <= 0 &&
      !hasActivePremiumSubscription(userSubscription) &&
      !hasActiveTrialSubscription(userSubscription)
    ) {
      if (botName === "Bind AI") {
        dispatch(
          modifybotQueryCount({
            botValue: "bind_ai",
            newQueryCount: 10,
          })
        );
        dispatch(
          showPopup({
            title: "",
            description: <PremiumPopup />,
            btnArray: [],
            classAdditions: {
              popupContainer:
                "w-full md:w-[28%] h-[90%] md:h-auto rounded-t-2xl",
              popup: "h-screen !rounded-none w-full md:h-auto md:!rounded-lg",
              additional: "fixed md:relative bottom-0",
            },
          })
        );
        return false;
      }
      dispatch(
        showPopup({
          title: "",
          description: (
            <FreeTierPopup
              heading={
                botName === "Web Search"
                  ? "You've hit the daily limit"
                  : "Subscribe to continue using"
              }
              icon={botName === "Web Search" ? "web-search" : "web-search1"}
              desc={
                botName === "Web Search"
                  ? "Get real-time, factual information from multiple sources. Research the web to get the best out of Bind AI"
                  : "Select advanced models, compile and execute the code."
              }
              buttonText={
                botName === "Web Search"
                  ? "Try Premium Search"
                  : "View Premium Features"
              }
              text="Learn more"
              handleClick={() => {
                dispatch(
                  showPopup({
                    title: "",
                    description: <PremiumPopup />,
                    btnArray: [],
                    classAdditions: {
                      popupContainer:
                        "w-full md:w-[28%] h-[90%] md:h-auto rounded-t-2xl",
                      popup:
                        "h-screen !rounded-none w-full md:h-auto md:!rounded-lg",
                      additional: "fixed md:relative bottom-0",
                    },
                  })
                );
              }}
              handleTextClick={() => {
                window.open(
                  botName === "Web Search"
                    ? "https://www.getbind.co/#web-search"
                    : "https://www.getbind.co/#code-generation",
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
      return false;
    }

    // Condition 4: Regular query count limit reached
    if (
      queryCounts &&
      queryCounts?.[botData?.model?.value]?.remaining <= 0 &&
      !hasActivePremiumSubscription(userSubscription) &&
      !hasActiveTrialSubscription(userSubscription)
    ) {
      dispatch(
        showPopup({
          title: "",
          description: <PremiumPopup />,
          btnArray: [],
          classAdditions: {
            popupContainer: "w-full md:w-[28%] h-[90%] md:h-auto rounded-t-2xl",
            popup: "h-screen !rounded-none w-full md:h-auto md:!rounded-lg",
            additional: "fixed md:relative bottom-0",
          },
        })
      );
      return false;
    }

    return true;
  };

  const updateHistory = useCallback((updater) => {
    setHistory((prevHistory) => updater(prevHistory));
  }, []);

  const decrementQueryCountFn = (modelName) => {
    dispatch(decrementQueryCount({ modelName }));
    if (
      (botName == "Web Search" ||
        botName == "Code Generator" ||
        botName == "Bind AI") &&
      !hasActivePremiumSubscription(userSubscription) &&
      !hasActiveTrialSubscription(userSubscription)
    ) {
      const botValue =
        botName == "Web Search"
          ? "web_search"
          : botName == "Code Generator"
          ? "code_generator"
          : "bind_ai";
      dispatch(decrementBotQueryCount({ botValue }));
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setShouldStopTyping(true);
      setTypingComplete(true);
      setStatus(0);
      setApiError(false);
    }
  };

  useEffect(() => {
    if (!userSubscription.loading && !loading) {
      setStatus(0);
      setApiError(false);

      var botData = JSON.parse(localStorage.getItem(botId)) || {};
      const initializeBotData = () => {
        if (!botData.sessionKey) {
          botData.sessionKey = Math.random().toString(36).substring(2, 15);
          dispatch(
            setCurrentSessionId({ botId, sessionId: botData.sessionKey })
          );
        } else {
          dispatch(
            setCurrentSessionId({ botId, sessionId: botData.sessionKey })
          );
        }

        const currentDefaultModel =
          botId == "660f2def795718a92af22fc1"
            ? "codestral-latest"
            : "gpt-4o-mini";

        const gpt4oModel = ModelCategory.find(
          (obj) => obj.value == "advanced_models"
        )?.botList.find((bot) => bot.value == currentDefaultModel);

        if (botData.model) {
          if (
            (!hasActivePremiumSubscription(userSubscription) &&
              !hasActiveTrialSubscription(userSubscription) &&
              botData.model?.type == "premium" &&
              botData.model?.value !== currentDefaultModel &&
              !userSubscription?.sumo_data) ||
            (userSubscription?.sumo_data &&
              !userSubscription?.sumo_data?.features?.advance_models
                ?.is_available)
          ) {
            handleModelChange(gpt4oModel);
          } else {
            dispatch(setLatestModel(botData.model));
          }
        } else {
          botData.model = gpt4oModel;
          localStorage.setItem(botId, JSON.stringify(botData));
          dispatch(setLatestModel(gpt4oModel));
        }
      };

      initializeBotData();

      if (!loading) {
        startChat();
      }
    }
  }, [userSubscription.loading, loading, toggledState]);

  useEffect(() => {
    const botData = getBotData(botId);
    if (!currentUser.uid) {
      setHistory([]);
      setApiError(false);
      setCode("");
      if (!botData?.model) {
        // setLatestModel({});
        dispatch(setLatestModel({}));
      }
    } else if (currentUser.uid) {
      if (botData.model) {
        dispatch(setLatestModel(botData.model));
      } else {
        const currentDefaultModel =
          botId == "660f2def795718a92af22fc1"
            ? "codestral-latest"
            : "gpt-4o-mini";
        const gpt4oModel = ModelCategory.find(
          (obj) => obj.value == "advanced_models"
        )?.botList.find((bot) => bot.value == currentDefaultModel);

        botData.model = gpt4oModel;
        localStorage.setItem(botId, JSON.stringify(botData));

        dispatch(setLatestModel(gpt4oModel));
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (typingComplete) {
      const lastMessage = history[history?.length - 1];
      if (lastMessage?.content && lastMessage?.type == "AIMessage") {
        const codePart = isCodePartPresent(lastMessage?.content);
        if (codePart) {
          const { language, content } = parseCode(codePart);

          if (content && language) {
            dispatch(setCode(content));
            dispatch(setLanguage(language));
            dispatch(setDynamicText(""));

            dispatch(setCodeEditor(true));
          }
        }
      }
    }
  }, [typingComplete]);

  return (
    <div className="flex-1 flex flex-col w-full">
      <div className="flex-1 flex flex-col justify-start scrollable-element ml-1 px-1">
        {isHistoryLoading ? (
          <ChatSkeleton />
        ) : (
          <MessageList
            botId={botId}
            history={history}
            status={status}
            botName={botName}
          />
        )}
      </div>
      {!shouldStopTyping &&
        !typingComplete &&
        typingEffectIndex !== null &&
        !apiError && (
          <div className="flex justify-center my-4">
            <div
              className="flex gap-3 items-center justify-center text-sm w-[167px] py-2 font-[500] border border-solid border-[#4529fa] rounded-lg bg-[#f5f5ff] shadow-md cursor-pointer"
              onClick={stopStreaming}
            >
              <Image src="/images/stop.png" alt="" width={14} height={14} />
              <p className="text-sm font-[500] text-[#4529FA]">
                Stop answering
              </p>
            </div>
          </div>
        )}

      {apiError && (
        <div className="flex justify-center my-4">
          <div
            className="flex gap-3 items-center justify-center text-sm w-[125px] py-2 font-[500] border border-solid border-[#9e1c1c] rounded-lg bg-[#f9f4f6] shadow-md cursor-pointer"
            onClick={handleRetry}
          >
            <Image src="/images/retry.png" alt="Retry" width={14} height={14} />
            <p className="text-sm font-[500] text-[#9E1C1C]">Try again</p>
          </div>
        </div>
      )}

      {/* {showBanner &&
        !loading &&
        !userSubscription.loading &&
        !userSubscription?.sumo_data &&
        userSubscription?.user_info?.subscription_plan !=
          process.env.NEXT_PUBLIC_ANNUAL_SCALE_PLAN && (
          <div className="mb-4">
            <BlackFridayDealsBanner
              {...getBannerProps(
                userSubscription?.user_info?.subscription_plan
              )}
              onClose={closeBanner}
            />
          </div>
        )} */}

      <MessageContainer
        handleSubmit={handleSubmit}
        isTyping={
          (!shouldStopTyping &&
            !typingComplete &&
            typingEffectIndex !== null) ||
          isHistoryLoading
        }
        apiError={apiError}
        className="mb-0 md:mb-6"
      />
    </div>
  );
});

MessageListView.displayName = "MessageListView";

export default MessageListView;
