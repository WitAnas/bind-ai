"use client";
import { useState, useRef, useEffect, useTransition, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import TypingText from "./TypingText.js";
import axios from "axios";
import {
  hidePopup,
  showPopup,
  showToaster,
} from "@/redux/reducers/commonReducer.js";
import LoginForm from "@/components/common/login/LoginForm.js";
import MessageContainer from "./MessageContainer.js";
import {
  clearBotMessage,
  setBotMessage,
  setCurrentBotId,
  setLatestModel,
} from "@/redux/reducers/botReducer.js";
import Image from "next/image";
import BotsData from "@/constants/bots.js";
import BotContainer from "@/components/common/BotContainer.js";
import ModelSelectButton from "./ModelSelectButton.js";
import copy from "copy-to-clipboard";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton.js";
import {
  hasActivePremiumSubscription,
  hasActiveTrialSubscription,
} from "@/utils/subscription/index.js";
import { ModelCategory } from "../constants/index.js";
import { usePathname, useRouter, useSearchParams } from "next/navigation.js";
import ModelCategoryContainer from "@/components/common/chat/ModelCategoryContainer.js";
import { callSearchAPI, removeQueryParam } from "@/utils/index.js";
import PremiumPopup from "@/components/common/premium/PremiumPopup.js";
import {
  decrementBotQueryCount,
  decrementQueryCount,
  incrementTotalQueriesThisMonth,
  modifybotQueryCount,
} from "@/redux/reducers/userSubscriptionReducer.js";
import Icon from "@/components/common/Icon.js";
import {
  setCanvasOpen,
  setCode,
  setCodeEditor,
  setDocumentEditor,
  setDynamicText,
  setLanguage,
} from "@/redux/reducers/codeEditorReducer.js";
import FreeTierPopup from "@/components/common/premium/FreetierPopup.js";
import { useClientMediaQuery } from "@/features/hooks/index.js";
import Markdown from "./Markdown.js";

import { setCurrentSessionId } from "@/redux/reducers/sessionReducer.js";
import SumoUsersLimitPopup from "@/features/sumo-app/components/SumoUsersLimitPopup.js";

const TestChatBot = ({ botId, botName }) => {
  const [status, setStatus] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [popupShown, setPopupShown] = useState(false);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const initialBotMessage = useSelector((state) => state.bot.initialBotMessage);
  const canvasOpen = useSelector((state) => state.code.canvasOpen);
  const [typingEffectIndex, setTypingEffectIndex] = useState(null);
  const [shouldStopTyping, setShouldStopTyping] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [failedRequest, setFailedRequest] = useState(null);
  // const [latestModel, setLatestModel] = useState({});
  const [isCopied, setIsCopied] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const isMobile = useClientMediaQuery("(max-width: 600px)");
  const userSubscription = useSelector((state) => state.userSubscription);
  const queryCounts = useSelector(
    (state) => state.userSubscription.user_info?.query_counts
  );
  const free_limit = useSelector(
    (state) => state.userSubscription.user_info?.free_limit
  );
  const loading = useSelector((state) => state.auth.loading);
  const { code, language, dynamicText } = useSelector((state) => state.code);
  const latestModel = useSelector((state) => state.bot.latestModel);
  const { toggledState } = useSelector((state) => state.sessions);

  const [history, setHistory] = useState([]);

  const abortControllerRef = useRef(null);
  const accumulatedDataRef = useRef("");
  const bottomEl = useRef(null);

  const scrollToBottom = () => {
    const resizeObserver = new ResizeObserver(() => {
      bottomEl?.current?.scrollIntoView({ behavior: "auto" });
    });

    const scrollableElement = bottomEl.current?.parentElement;
    if (scrollableElement) {
      resizeObserver.observe(scrollableElement);
    }

    return () => {
      if (scrollableElement) {
        resizeObserver.unobserve(scrollableElement);
      }
    };
  };

  const getBotData = (botId) => {
    const botData = localStorage.getItem(botId);

    return botData ? JSON.parse(botData) : {};
  };

  const handleSubDescClick = (url) => {
    window.open(url, "_blank");
  };

  const handleTextClick = (category, switchs) => {
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

  const handlePayment = async () => {
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

    let apiEndpoint;

    apiEndpoint = process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/checkout";

    const formData = new FormData();
    formData.append("plan", "monthly");

    if (currentUser?.uid) {
      formData.append("user_id", currentUser.uid);
    }

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);

    url.search = "";

    const successUrl = `${url.href}?paymentSuccess=true`;
    const cancelUrl = `${url.href}?paymentFailed=true`;

    formData.append("success_url", successUrl);
    formData.append("cancel_url", cancelUrl);

    try {
      const response = await axios.post(apiEndpoint, formData);

      if (response?.data?.status === "success") {
        window.location.href = response.data.url;
      } else {
        dispatch(
          showToaster({
            variant: "error",
            title: "Something went wrong. Please try again after some time.",
            description: "",
          })
        );
      }
    } catch (error) {
      console.log("Error during payment:", error);
      dispatch(
        showToaster({
          variant: "error",
          title: "Something went wrong. Please try again after some time.",
          description: "",
        })
      );
    }
  };

  const updateHistory = useCallback((updater) => {
    setHistory((prevHistory) => updater(prevHistory));
  }, []);

  // const debouncedUpdateHistory = useCallback(
  //   debounce((content) => {
  //     updateHistory((prevHistory) => {
  //       const newHistory = [...prevHistory];
  //       if (newHistory.length > 0) {
  //         newHistory[newHistory.length - 1].content = content;
  //       }
  //       return newHistory;
  //     });
  //   }, 100),
  //   [updateHistory]
  // );
  const handleSubmit = async (msg, setMsg) => {
    // e.preventDefault();
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

      setQueryCount(0);
    } else if (
      currentUser.uid &&
      getBotData(botId).model?.value == "gpt-4-omni" &&
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
              handleClick={handlePayment}
              handleTextClick={() => {
                handleTextClick(
                  {
                    name: "Fast General Purpose",
                    value: "general_purpose",
                  },
                  false
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
          let apiEndpoint = process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/stream";
          if (botName == "Bind Pro") {
            apiEndpoint = process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/search";
          } else if (botName == "Web Search") {
            apiEndpoint =
              process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/websearch";
          }
          botData = getBotData(botId);

          if (
            userSubscription?.sumo_data &&
            userSubscription?.sumo_data?.features
              ?.allowed_model_queries_per_month?.number_of_queries <=
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
                    features={[
                      "OpenAI GPT-4o",
                      "Claude 3.5 Sonnet",
                      "Llama 3.1",
                    ]}
                    ctaHeading={
                      userSubscription?.sumo_data
                        ? "Upgrade to Next Tier"
                        : userSubscription?.user_info?.trial_available ===
                            true ||
                          userSubscription?.user_info?.trial_available ===
                            "true"
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
            return;
          }

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
                  popupContainer:
                    "w-full md:w-[28%] h-[90%] md:h-auto rounded-t-2xl",
                  popup:
                    "h-screen !rounded-none w-full md:h-auto md:!rounded-lg",
                  additional: "fixed md:relative bottom-0",
                },
              })
            );
            return;
          }

          if (
            (botName == "Web Search" ||
              botName == "Code Generator" ||
              botName == "Bind AI") &&
            free_limit &&
            free_limit?.[
              botName == "Web Search"
                ? "web_search"
                : botName == "Code Generator"
                ? "code_generator"
                : "bind_ai"
            ]?.remaining <= 0 &&
            !hasActivePremiumSubscription(userSubscription) &&
            !hasActiveTrialSubscription(userSubscription)
          ) {
            if (botName == "Bind AI") {
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
                    popup:
                      "h-screen !rounded-none w-full md:h-auto md:!rounded-lg",
                    additional: "fixed md:relative bottom-0",
                  },
                })
              );
              return;
            }
            dispatch(
              showPopup({
                title: "",
                description: (
                  <FreeTierPopup
                    heading={
                      botName == "Web Search"
                        ? "You've hit the daily limit"
                        : "Subscribe to continue using"
                    }
                    icon={
                      botName == "Web Search" ? "web-search" : "web-search1"
                    }
                    desc={
                      botName == "Web Search"
                        ? "Get real-time, factual information from multiple sources. Research the web to get the best out of Bind AI"
                        : "Select advanced models, compile and execute the code."
                    }
                    buttonText={
                      botName == "Web Search"
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
                        `${
                          botName == "Web Search"
                            ? "https://www.getbind.co/#web-search"
                            : "https://www.getbind.co/#code-generation"
                        }`,
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

            return;
          }

          setMsg("");
          setStatus(1);
          updateHistory((prevHistory) => [
            ...prevHistory,
            { type: "human", content: msg },
            { type: "loading" },
          ]);

          const formData = new FormData();
          formData.append("botId", botId);
          formData.append("inputText", msg);
          formData.append(
            "modelName",
            botData?.model?.value ||
              (botId == "660f2def795718a92af22fc1"
                ? "codestral-latest"
                : "gpt-4o-mini")
          );
          currentUser?.uid && formData.append("userId", currentUser.uid);
          formData.append("sessionKey", botData?.sessionKey);
          // if (currentUser?.uid) {
          //   const contextSearch = await callSearchAPI(msg, 2, currentUser?.uid);

          //   formData.append("embeddings", JSON.stringify(contextSearch));
          // }

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

              if (botName !== "Web Search") {
                updateHistory((prevHistory) => {
                  const newHistory = [...prevHistory];
                  newHistory.pop(); // Remove loading state
                  newHistory.push({ type: "AIMessage", content: "" });

                  return newHistory;
                });
                setTypingEffectIndex(history.length - 1);
              }

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

                if (botName == "Web Search") {
                  const parsedData = JSON.parse(accumulatedDataRef.current);
                  updateHistory((prevHistory) => {
                    const newHistory = [...prevHistory];
                    newHistory.pop(); // Remove loading state
                    newHistory.push({
                      type: "AIMessage",
                      content: parsedData?.message,
                    });
                    setTypingEffectIndex(newHistory.length - 1);

                    return newHistory;
                  });
                } else {
                  // debouncedUpdateHistory(accumulatedDataRef.current);
                  updateHistory((prevHistory) => {
                    const newHistory = [...prevHistory];
                    if (newHistory.length > 0) {
                      newHistory[newHistory.length - 1].content =
                        accumulatedDataRef.current;
                    }
                    return newHistory;
                  });
                }
              }

              if (botName !== "Web Search") {
                setShouldStopTyping(true);
                setTypingComplete(true);
              }

              setStatus(0);
              setApiError(false);
            } else {
              setApiError(true);
              setFailedRequest({ msg });
              setStatus(0);
              updateHistory((prevHistory) => {
                const newHistory = [...prevHistory];
                newHistory.pop();
                return newHistory;
              });
            }
          } catch (error) {
            console.log("Error sending message:", error);
            setStatus(0);
            if (error.name === "AbortError") {
              console.log("Streaming aborted by user.");
            } else {
              setApiError(true);
              setFailedRequest({ msg });

              updateHistory((prevHistory) => {
                const newHistory = [...prevHistory];
                newHistory.pop();
                return newHistory;
              });
            }
          }
        }
      }
    }
  };

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

  const startChat = async () => {
    const botData = getBotData(botId);

    setStatus(1);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEW_BACKEND_URL}/chatHistory?session=${botData?.sessionKey}`
      );

      const previousMessages = res?.data?.msg || [];

      if (previousMessages.length > 0) {
        // tmp.push(...previousMessages);
        // setHistory(previousMessages);
        updateHistory((prevHistory) => [...previousMessages]);
      } else {
        // tmp.push(...previousMessages);
        // setHistory(previousMessages);
        updateHistory((prevHistory) => [...previousMessages]);
      }
    } catch (error) {
      console.log("history api error", error);
    }

    const query = params.get("query");

    if (query || initialBotMessage) {
      const txt = initialBotMessage ? initialBotMessage : query;
      if (txt !== "") {
        if (
          queryCounts &&
          queryCounts[botData?.model?.value]?.remaining <= 0 &&
          !hasActivePremiumSubscription(userSubscription) &&
          !hasActiveTrialSubscription(userSubscription)
        ) {
          setStatus(0);
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
          return;
        } else if (
          currentUser.uid &&
          getBotData(botId).model?.value == "gpt-4-omni" &&
          tmp?.length >= 10 &&
          !hasActivePremiumSubscription(userSubscription) &&
          !hasActiveTrialSubscription(userSubscription) &&
          !userSubscription?.sumo_data
        ) {
          setStatus(0);
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
                  handleClick={handlePayment}
                  handleTextClick={() => {
                    handleTextClick(
                      {
                        name: "Fast General Purpose",
                        value: "general_purpose",
                      },
                      false
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
          return;
        } else if (
          (botName == "Web Search" ||
            botName == "Code Generator" ||
            botName == "Bind AI") &&
          free_limit &&
          free_limit?.[
            botName == "Web Search"
              ? "web_search"
              : botName == "Code Generator"
              ? "code_generator"
              : "bind_ai"
          ]?.remaining <= 0 &&
          !hasActivePremiumSubscription(userSubscription) &&
          !hasActiveTrialSubscription(userSubscription)
        ) {
          setStatus(0);
          if (botName == "Bind AI") {
            dispatch(
              modifybotQueryCount({
                botVlaue: "bind_ai",
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
                  popup:
                    "h-screen !rounded-none w-full md:h-auto md:!rounded-lg",
                  additional: "fixed md:relative bottom-0",
                },
              })
            );
            return;
          }
          dispatch(
            showPopup({
              title: "",
              description: (
                <FreeTierPopup
                  heading={
                    botName == "Web Search"
                      ? "You've hit the daily limit"
                      : "Subscribe to continue using"
                  }
                  icon={botName == "Web Search" ? "web-search" : "web-search1"}
                  desc={
                    botName == "Web Search"
                      ? "Get real-time, factual information from multiple sources. Research the web to get the best out of Bind AI"
                      : "Select advanced models, compile and execute the code."
                  }
                  buttonText={
                    botName == "Web Search"
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
                      `${
                        botName == "Web Search"
                          ? "https://www.getbind.co/#web-search"
                          : "https://www.getbind.co/#code-generation"
                      }`,
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

          return;
        }

        if (initialBotMessage) {
          dispatch(clearBotMessage());
        } else if (query) {
          removeQueryParam("query", router, params, pathname);
        }

        if (
          userSubscription?.sumo_data &&
          userSubscription?.sumo_data?.features?.allowed_model_queries_per_month
            ?.number_of_queries <=
            userSubscription?.sumo_data?.total_queries_this_month
        ) {
          setStatus(0);
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
          return;
        }

        updateHistory((prevHistory) => [
          ...prevHistory,
          { type: "human", content: txt },
          { type: "loading" },
        ]);

        let apiEndpoint = process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/stream";
        if (botName == "Bind Pro") {
          apiEndpoint = process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/search";
        } else if (botName == "Web Search") {
          apiEndpoint = process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/websearch";
        }
        const formData = new FormData();
        formData.append("botId", botId);
        formData.append("sessionKey", botData?.sessionKey);
        formData.append("inputText", txt);
        formData.append(
          "modelName",
          botData?.model?.value ||
            (botId == "660f2def795718a92af22fc1"
              ? "codestral-latest"
              : "gpt-4o-mini")
        );
        currentUser?.uid && formData.append("userId", currentUser.uid);

        // if (botName == "Custom Bot" && currentUser?.uid) {
        //   const contextSearch = await callSearchAPI(txt, 2, currentUser?.uid);

        //   formData.append("embeddings", JSON.stringify(contextSearch));
        // }

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
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            accumulatedDataRef.current = "";

            if (botName !== "Web Search") {
              updateHistory((prevHistory) => {
                const newHistory = [...prevHistory];
                newHistory.pop(); // Remove loading state
                newHistory.push({ type: "AIMessage", content: "" });

                return newHistory;
              });
              setTypingEffectIndex(history.length - 1);
            }

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

              if (botName == "Web Search") {
                const parsedData = JSON.parse(accumulatedDataRef.current);
                updateHistory((prevHistory) => {
                  const newHistory = [...prevHistory];
                  newHistory.pop(); // Remove loading state
                  newHistory.push({
                    type: "AIMessage",
                    content: parsedData?.message,
                  });
                  setTypingEffectIndex(newHistory.length - 1);

                  return newHistory;
                });
              } else {
                // debouncedUpdateHistory(accumulatedDataRef.current);
                updateHistory((prevHistory) => {
                  const newHistory = [...prevHistory];
                  if (newHistory.length > 0) {
                    newHistory[newHistory.length - 1].content =
                      accumulatedDataRef.current;
                  }
                  return newHistory;
                });
              }
            }
            if (botName !== "Web Search") {
              setShouldStopTyping(true);
              setTypingComplete(true);
            }

            setStatus(0);
            setApiError(false);
          } else {
            setApiError(true);
            const msg = txt;
            setFailedRequest({ msg });
            setStatus(0);
            updateHistory((prevHistory) => {
              const newHistory = [...prevHistory];
              newHistory.pop(); // Remove loading state
              return newHistory;
            });
          }
        } catch (error) {
          console.log("Error sending message:", error);
          if (error.name === "AbortError") {
            console.log("Streaming aborted by user.");
          } else {
            setApiError(true);
            const msg = txt;
            setFailedRequest({ msg });
            updateHistory((prevHistory) => {
              const newHistory = [...prevHistory];
              newHistory.pop(); // Remove loading state
              return newHistory;
            });
            setStatus(0);
          }
        }
      }
    }
    setStatus(0);
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
    dispatch(setCurrentBotId(botId));
  }, [botId]);

  useEffect(() => {
    if (!userSubscription.loading && !loading) {
      setStatus(0);

      var botData = JSON.parse(localStorage.getItem(botId)) || {};
      const initializeBotData = () => {
        if (!botData.sessionKey) {
          botData.sessionKey = Math.random().toString(36).substring(2, 15);
          dispatch(
            setCurrentSessionId({ botId, sessionId: botData.sessionKey })
          );
          // localStorage.setItem(botId, JSON.stringify(botData));
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
          // setLatestModel(botData.model);
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

          // setLatestModel(gpt4oModel);
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
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  }, [botId]);

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
        // setLatestModel(botData.model);
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

        // setLatestModel(gpt4oModel);
        dispatch(setLatestModel(gpt4oModel));
      }
    }
  }, [currentUser]);

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
                      false
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
                      false
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

  const handleRetry = async () => {
    if (failedRequest && apiError) {
      setApiError(false);
      const { msg } = failedRequest;

      updateHistory((prevHistory) => [...prevHistory, { type: "loading" }]);

      const apiEndpoint =
        botName == "Bind Pro"
          ? `${process.env.NEXT_PUBLIC_NEW_BACKEND_URL}/search`
          : botName == "Web Search"
          ? `${process.env.NEXT_PUBLIC_NEW_BACKEND_URL}/websearch`
          : `${process.env.NEXT_PUBLIC_NEW_BACKEND_URL}/stream`;

      const botData = getBotData(botId);
      const formData = new FormData();
      formData.append("botId", botId);
      formData.append("inputText", msg);
      formData.append("modelName", botData?.model?.value || "gpt-4o-mini");
      currentUser?.uid && formData.append("userId", currentUser.uid);
      formData.append("sessionKey", botData?.sessionKey);

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

          if (botName !== "Web Search") {
            updateHistory((prevHistory) => {
              const newHistory = [...prevHistory];
              newHistory.pop();
              newHistory.push({ type: "AIMessage", content: "" });

              return newHistory;
            });
            setTypingEffectIndex(history.length - 1);
          }

          setShouldStopTyping(false);
          setTypingComplete(false);
          decrementQueryCountFn(botData?.model?.value);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);

            accumulatedDataRef.current += chunk;

            if (botName == "Web Search") {
              const parsedData = JSON.parse(accumulatedDataRef.current);
              updateHistory((prevHistory) => {
                const newHistory = [...prevHistory];
                newHistory.pop(); // Remove loading state
                newHistory.push({
                  type: "AIMessage",
                  content: parsedData?.message,
                });
                setTypingEffectIndex(newHistory.length - 1);

                return newHistory;
              });
            } else {
              // debouncedUpdateHistory(accumulatedDataRef.current);
              updateHistory((prevHistory) => {
                const newHistory = [...prevHistory];
                if (newHistory.length > 0) {
                  newHistory[newHistory.length - 1].content =
                    accumulatedDataRef.current;
                }
                return newHistory;
              });
            }
          }
          if (botName !== "Web Search") {
            setShouldStopTyping(true);
            setTypingComplete(true);
          }

          setApiError(false);
        } else {
          setApiError(true);
          setFailedRequest({ msg });
          setStatus(0);
          updateHistory((prevHistory) => {
            const newHistory = [...prevHistory];
            newHistory.pop();
            return newHistory;
          });
        }
      } catch (error) {
        console.log("Error sending message:", error);
        setStatus(0);
        if (error.name === "AbortError") {
          console.log("Streaming aborted by user.");
        } else {
          setApiError(true);
          setFailedRequest({ msg });
          updateHistory((prevHistory) => {
            const newHistory = [...prevHistory];
            newHistory.pop();
            return newHistory;
          });
        }
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

  const parseCode = (code) => {
    if (!code) return { language: "javascript", content: "" };

    const lines = code?.split("\n");
    const language = lines[0]?.trim()?.toLowerCase() || "javascript";
    const content = lines?.slice(1).join("\n");

    return { language, content };
  };

  // const isCodePartPresent = (response) => {
  //   const codeStartIndex = response.indexOf("```");

  //   if (codeStartIndex !== -1) {
  //     const codeEndIndex = response.lastIndexOf("```");
  //     const codePart = response.slice(codeStartIndex + 3, codeEndIndex).trim();

  //     if (codePart) {
  //       return true;
  //     }
  //   } else {
  //     return false;
  //   }
  // };

  const isCodePartPresent = (response) => {
    const regex = /```([^`]+)```/;

    const match = response?.match(regex);

    if (match) {
      const codePart = match[1];

      if (codePart) {
        return codePart;
      }
    } else {
      return false;
    }
  };

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

      {/* <div
        onClick={() => {
          dispatch(incrementTotalQueriesThisMonth());
        }}
      >
        increase count
      </div> */}

      <div className="chat relative h-[calc(100vh-142px)]">
        <div
          className={`flex h-[calc(100vh-142px)] ${
            canvasOpen ? "w-11/12" : isMobile ? "w-[95%]" : "max-w-[980px]"
          } mx-auto`}
        >
          <div className="flex-1 flex flex-col w-full">
            <div className="flex-1  flex flex-col justify-start scrollable-element ml-1 px-1">
              <div className="flex flex-col">
                {history.map((item, index) => {
                  return (
                    <div key={index} className="break-words">
                      {item.type == "human" ? (
                        <div className={`msg  rounded-lg my-2`} key={index}>
                          {" "}
                          <div className="flex gap-2 items-center text-sm">
                            <div className="bg-primary rounded-full w-7 h-7 flex justify-center items-center">
                              <Image
                                src={`/images/person.png`}
                                alt=""
                                width={14}
                                height={14}
                              />
                            </div>
                            <h6 className="text-primary font-[Inter,sans-serif] font-[600] dark:text-darkPrimary">
                              {"You"}
                            </h6>
                          </div>
                          <p className="mt-2 text-[15px] font-[400] text-primary font-[Inter,sans-serif] dark:text-white">
                            {item.content}
                            {/* {item.image && (
                              <div className="mt-2">
                                <Image
                                  src={item.image}
                                  alt="User image"
                                  className=" w-[30%] h-fit rounded-lg"
                                  width={200}
                                  height={200}
                                />
                              </div>
                            )} */}
                          </p>
                        </div>
                      ) : (
                        <div className="pb-6 pt-2 rounded-lg my-2" key={index}>
                          <div className="flex gap-2 items-center text-sm">
                            {/* <img src="/images/bindGpt.png" /> */}
                            <Image
                              src={`/images/${
                                darkMode ? "darkBindGpt" : "bindGpt"
                              }.png`}
                              alt=""
                              width={23}
                              height={23}
                            />
                            <h6 className="text-primary font-[600] font-[Inter,sans-serif] dark:text-darkPrimary">
                              {botName}
                            </h6>
                          </div>
                          <p className="mt-2 text-[15px] font-[400] text-primary font-[Inter,sans-serif] dark:text-white">
                            {status == 1 &&
                            item.type == "loading" &&
                            !item?.content ? (
                              <LoadingSkeleton key={index} />
                            ) : botName == "Web Search" ? (
                              <TypingText
                                text={item?.content}
                                isTyping={index === typingEffectIndex}
                                stopTyping={shouldStopTyping}
                                setTypingComplete={setTypingComplete}
                              />
                            ) : (
                              <Markdown
                                key={item?.content}
                                markdownText={item?.content}
                              />
                            )}
                          </p>

                          {item.type != "loading" && item?.content && (
                            <div
                              className={`flex items-center ${
                                isCodePartPresent(item?.content)
                                  ? "justify-end"
                                  : "justify-between"
                              }  mt-4`}
                            >
                              {!isCodePartPresent(item?.content) && (
                                <div className="flex items-center cursor-pointer gap-1">
                                  {/* {(isCodePartPresent(item?.content) ||
                                  dynamicText) && (
                                  <Icon
                                    type={"open-editor"}
                                    fill={darkMode && "#F2F3F4"}
                                    className="block ml-[1px]"
                                  />
                                )} */}
                                  <Icon
                                    type={"open-editor"}
                                    fill={darkMode && "#F2F3F4"}
                                    className="block ml-[1px]"
                                  />

                                  <p
                                    className="text-secondary dark:text-[#F2F3F4] text-sm font-medium "
                                    onClick={() => {
                                      const response = item?.content;
                                      const codeStartIndex =
                                        response.indexOf("```");

                                      if (codeStartIndex !== -1) {
                                        const textPart = response
                                          .slice(0, codeStartIndex)
                                          .trim();
                                        const codeEndIndex =
                                          response.lastIndexOf("```");
                                        const codePart = response
                                          .slice(
                                            codeStartIndex + 3,
                                            codeEndIndex
                                          )
                                          .trim();

                                        // setDynamicText(textPart);
                                        // dispatch(setDynamicText(textPart));

                                        if (codePart) {
                                          const { language, content } =
                                            parseCode(codePart);

                                          if (content && language) {
                                            dispatch(setCode(content));
                                            dispatch(setLanguage(language));
                                            dispatch(setDynamicText(""));
                                            dispatch(setCodeEditor(true));
                                          }
                                        }
                                      } else {
                                        // setDynamicText(response);
                                        dispatch(setDynamicText(response));
                                        dispatch(setLanguage(""));
                                        dispatch(setCode(""));
                                        dispatch(setDocumentEditor(true));
                                      }
                                    }}
                                  >
                                    {isCodePartPresent(item?.content)
                                      ? "Open in code editor"
                                      : "Open in Editor"}
                                  </p>
                                </div>
                              )}

                              <div className="flex items-center justify-center gap-3 mr-4">
                                <div
                                  className="cursor-pointer"
                                  onClick={async () => {
                                    const content = item?.content;
                                    if (content) {
                                      setIsCopied(index);
                                      copy(content);

                                      setTimeout(() => {
                                        setIsCopied(null);
                                      }, 3000);
                                    }
                                  }}
                                >
                                  {isCopied == index ? (
                                    <>
                                      <Image
                                        src="/svgs/checkmark.svg"
                                        alt="checkmark"
                                        width={16}
                                        height={16}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <Image
                                        src="/svgs/copy.svg"
                                        alt="copy"
                                        width={16}
                                        height={16}
                                      />
                                    </>
                                  )}
                                </div>
                                <div className="cursor-pointer ">
                                  <Image
                                    src="/svgs/like.svg"
                                    alt="like"
                                    width={16}
                                    height={16}
                                  />
                                </div>
                                <div className="cursor-pointer ">
                                  <Image
                                    src="/svgs/dislike.svg"
                                    alt="dislike"
                                    width={16}
                                    height={16}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={bottomEl}></div>
              </div>
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
                    <Image
                      src="/images/stop.png"
                      alt=""
                      width={14}
                      height={14}
                    />
                    <p className="text-sm font-[500] text-[#4529FA]">
                      Stop answering
                    </p>
                  </div>
                </div>
              )}

            {apiError && (
              <>
                <div className="flex justify-center my-4">
                  <div
                    className="flex gap-3 items-center justify-center text-sm w-[125px] py-2 font-[500] border border-solid border-[#9e1c1c] rounded-lg bg-[#f9f4f6] shadow-md cursor-pointer"
                    onClick={handleRetry}
                  >
                    <Image
                      src="/images/retry.png"
                      alt="Retry"
                      width={14}
                      height={14}
                    />
                    <p className="text-sm font-[500] text-[#9E1C1C]">
                      Try again
                    </p>
                  </div>
                </div>
                {/* <div className="bg-[#fffaf5] p-4 border border-[#fb8e01] rounded-lg flex flex-col gap-3 my-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 w-full">
                      <BiSolidError size={18} className="text-[#fb8e00]" />
                      <h3 className="text-primary font-medium text-base w-full m-0">
                        You have reached the limit
                      </h3>
                    </div>
                    <MdOutlineClose
                      size={100}
                      className={` text-darkLabel h-6 w-6 cursor-pointer `}
                      onClick={() => dispatch(hidePopup())}
                    />
                  </div>
                  <p className="text-primary text-sm font-normal">
                    Subscribe to Premium and get additional 1 million compute
                    points.
                  </p>
                  <div className="flex gap-4 items-center">
                    <Button
                      variant="primary"
                      size="medium"
                      className=" !bg-darkMutedPurple !px-2 !py-2.5 !rounded-lg flex items-center gap-1.5"
                      onClick={() =>
                        window.open(
                          process.env.NEXT_PUBLIC_CREATE_AI_BOT_LINK ||
                            "https://app.getbind.co/?utm_source=top-nav&utm_medium=canvas&utm_campaign=create_AI_copilot",
                          "_blank"
                        )
                      }
                    >
                      <Icon
                        type={"premium-icon"}
                        width={100}
                        height={100}
                        fill={"white"}
                        className=" w-[18px] h-[18px] "
                      />
                      <span className="text-white text-sm font-normal">
                        Become a Premium
                      </span>
                    </Button>
                    <div
                      className="text-darkLabel font-normal text-sm underline cursor-pointer"
                      style={{ textUnderlineOffset: "3px" }}
                    >
                      Add your own API key
                    </div>
                  </div>
                </div> */}
              </>
            )}

            <MessageContainer
              handleSubmit={handleSubmit}
              isTyping={
                !shouldStopTyping &&
                !typingComplete &&
                typingEffectIndex !== null
              }
              apiError={apiError}
              className="mb-0 md:mb-6"
            />
          </div>
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

export default TestChatBot;
