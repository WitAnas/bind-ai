import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidEdit } from "react-icons/bi";
import { format, isToday, isYesterday, subDays, subMonths } from "date-fns";
import { BsThreeDots } from "react-icons/bs";
import {
  expandSidebar,
  showPopup,
  showToaster,
  toggleThreadBar,
} from "@/redux/reducers/commonReducer";
import {
  createNewSession,
  fetchSessionList,
  setCurrentSessionId,
  toggleState,
} from "@/redux/reducers/sessionReducer";
import Icon from "../Icon";
import { useClientMediaQuery } from "@/features/hooks";
import { usePathname, useRouter } from "next/navigation";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "../PopoverContent";
import { MdDelete } from "react-icons/md";
import DeleteConfirmPopup from "../canvas/DeleteConfirmPopup";
import axios from "axios";

const Threads = ({ botId, origin }) => {
  const threadBarOpen = useSelector((state) => state.common.threadBarOpen);
  const sidebarOpen = useSelector((state) => state.common.sidebarCollapsed);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isMobile = useClientMediaQuery("(max-width: 600px)");

  const dispatch = useDispatch();
  const router = useRouter();
  const param = usePathname();
  const initialTab = "/" + param.split("/")[1];

  const {
    sessions,
    loading: sessionLoading,
    error,
  } = useSelector((state) => state.sessions);
  const currentSessionId = useSelector(
    (state) => state.sessions?.sessions[botId]?.currentSessionId
  );

  // Helper function to categorize threads
  const categorizeThreads = () => {
    const todayThreads = [];
    const yesterdayThreads = [];
    const previousWeekThreads = [];
    const lastMonthThreads = [];
    const now = new Date();

    if (!sessions[botId] || !sessions[botId].list)
      return {
        todayThreads,
        yesterdayThreads,
        previousWeekThreads,
        lastMonthThreads,
      };

    const getThreadTimestamp = (thread) => {
      return new Date(thread?.updated_at || thread?.created_at).getTime();
    };

    const sortThreadsByTimestamp = (threads) => {
      return threads.sort((a, b) => {
        const timestampA = getThreadTimestamp(a);
        const timestampB = getThreadTimestamp(b);
        return timestampB - timestampA;
      });
    };

    sessions[botId].list.forEach((thread) => {
      if (!thread?.updated_at && !thread?.created_at) {
        todayThreads.push(thread);
      } else {
        const threadDate = new Date(thread?.updated_at || thread?.created_at);

        if (isToday(threadDate)) {
          todayThreads.push(thread);
        } else if (isYesterday(threadDate)) {
          yesterdayThreads.push(thread);
        } else if (threadDate >= subDays(now, 7)) {
          previousWeekThreads.push(thread);
        } else if (threadDate >= subMonths(now, 1)) {
          lastMonthThreads.push(thread);
        }
      }
    });

    // Sort each category by timestamp
    return {
      todayThreads: sortThreadsByTimestamp(todayThreads),
      yesterdayThreads: sortThreadsByTimestamp(yesterdayThreads),
      previousWeekThreads: sortThreadsByTimestamp(previousWeekThreads),
      lastMonthThreads: sortThreadsByTimestamp(lastMonthThreads),
    };
  };

  const handleDelete = (sessionId) => {
    dispatch(
      showPopup({
        title: "",
        description: (
          <DeleteConfirmPopup
            handleDeleteAgent={() => handleDeleteThread(botId, sessionId)}
            thread={true}
          />
        ),
        btnArray: [],
        classAdditions: {
          popupContainer: `
         w-[400px] 
        `,
          popup:
            " !w-full !border dark:border-[#ffffff1e] border-[#E4E5EA] dark:bg-[#26282c] p-7",
        },
      })
    );
  };

  const handleDeleteThread = async (botId, sessionId) => {
    try {
      const params = new URLSearchParams();
      params.append("session", sessionId);

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_NEW_BACKEND_URL}/chatHistory`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: params,
        }
      );

      if (response?.data?.status === "success") {
        dispatch(
          showToaster({
            variant: "success",
            title: "Thread deleted successfully",
            description: "",
          })
        );

        dispatch(
          fetchSessionList({
            userId: currentUser?.uid,
            botId: botId ? botId : "661cacc79657814effd8db6c",
          })
        );

        if (currentSessionId === sessionId) {
          dispatch(toggleState());
        }
      }
    } catch (error) {
      console.log("error in deleting thread ", error);
      dispatch(
        showToaster({
          variant: "error",
          title: "Failed to delete thread",
          description: "",
        })
      );
    }
  };

  const {
    todayThreads,
    yesterdayThreads,
    previousWeekThreads,
    lastMonthThreads,
  } = categorizeThreads();

  const renderThreads = (threads) => (
    <div className="md:mb-2.5 mb-4">
      {threads.map((thread) => (
        <div
          key={thread.sessionKey}
          className="md:py-2.5 py-3.5 pl-4 mb-0.5 md:mb-0 hover:bg-[#e4e5ea80] dark:hover:bg-white12 relative group cursor-pointer"
          onClick={() => {
            if (initialTab !== "/chat" && isMobile) {
              router.push(`/chat/661cacc79657814effd8db6c`);
            }
            if (origin && origin == "home") {
              dispatch(
                setCurrentSessionId({ botId, sessionId: thread.sessionKey })
              );
              router.push(`/chat/${botId}`);
            } else {
              if (currentSessionId !== thread.sessionKey) {
                dispatch(
                  setCurrentSessionId({ botId, sessionId: thread.sessionKey })
                );
                dispatch(toggleState());
              }

              if (isMobile) {
                dispatch(toggleThreadBar());
                if (!threadBarOpen) {
                  if (sidebarOpen) dispatch(expandSidebar());
                }
              }
            }
          }}
        >
          {currentSessionId === thread.sessionKey && (
            <div className="absolute w-1 h-[70%] bg-darkMutedPurple left-0 rounded-r-full top-1/2 transform -translate-y-1/2"></div>
          )}
          <p className="text-primary dark:text-white text-sm font-medium truncate">
            {thread.summary || "New Thread"}
          </p>
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-5 h-5 py-0.5 px-1 bg-white rounded-md flex items-center justify-center cursor-pointer dark:bg-darkProject"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Popover>
              <PopoverTrigger>
                <BsThreeDots className="w-full h-full text-primary dark:text-white" />
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={5}
                className="bg-white dark:bg-darkPopup rounded-xl border dark:border-[#ffffff1e] border-lightBorder "
              >
                <div className=" flex flex-col ">
                  <PopoverClose>
                    <div
                      className="flex items-center hover:dark:bg-white12 hover:bg-[#e4e5ea] px-3 py-[10px] pr-10 cursor-pointer"
                      onClick={(e) => {
                        handleDelete(thread.sessionKey);
                      }}
                    >
                      <MdDelete
                        size={17}
                        className=" dark:text-white text-primary mr-2"
                      />

                      <span className=" text-primary font-medium  text-sm dark:text-white">
                        Delete
                      </span>
                    </div>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      ))}
    </div>
  );

  const renderThreadSection = () => {
    if (sessionLoading) {
      return (
        <div className="text-center py-4 dark:text-white">
          Loading threads...
        </div>
      );
    }

    // if (error) {
    //   return (
    //     <div className="text-center py-4 text-red-500">Error: {error}</div>
    //   );
    // }

    if (!sessions[botId] || sessions[botId].list.length === 0) {
      return (
        <div className="text-center py-4 dark:text-white">
          No threads available
        </div>
      );
    }

    return (
      <>
        {todayThreads.length > 0 && (
          <>
            <h2 className="text-darkLabel dark:text-darkLabel text-xs font-semibold pl-4 md:mb-1 mb-2">
              Today
            </h2>
            {renderThreads(todayThreads)}
          </>
        )}

        {yesterdayThreads.length > 0 && (
          <>
            <h2 className="text-darkLabel dark:text-darkLabel text-xs font-semibold pl-4 md:mb-1 mb-2">
              Yesterday
            </h2>
            {renderThreads(yesterdayThreads)}
          </>
        )}

        {previousWeekThreads.length > 0 && (
          <>
            <h2 className="text-darkLabel dark:text-darkLabel text-xs font-semibold pl-4 md:mb-1 mb-2">
              Last 7 Days
            </h2>
            {renderThreads(previousWeekThreads)}
          </>
        )}

        {lastMonthThreads.length > 0 && (
          <>
            <h2 className="text-darkLabel dark:text-darkLabel text-xs font-semibold pl-4 md:mb-1 mb-2">
              Last Month
            </h2>
            {renderThreads(lastMonthThreads)}
          </>
        )}
      </>
    );
  };

  return (
    <div className="">
      {!threadBarOpen ? (
        <div
          className="flex items-center justify-center px-2 mx-2 pt-8 pb-5 border-b border-lightBorder dark:border-[#ffffff1e] cursor-pointer"
          onClick={() => {
            dispatch(toggleThreadBar());
            if (!threadBarOpen) {
              if (sidebarOpen) dispatch(expandSidebar());
            }
          }}
        >
          <FaAngleRight
            height={12}
            width={6}
            className="dark:text-[#a9adbb] text-[#5f6368]"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between md:pt-6 pt-4 pb-4 pl-4 md:pr-4">
          <h1 className="text-primary text-base font-medium dark:text-white">
            Threads
          </h1>
          {!isMobile ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                dispatch(toggleThreadBar());
                if (!threadBarOpen) {
                  if (sidebarOpen) dispatch(expandSidebar());
                }
              }}
            >
              <FaAngleLeft
                size={12}
                className="min-w-2 min-h-3 dark:text-[#a9adbb] text-tertiary"
              />
            </div>
          ) : (
            <div className="flex justify-center items-center w-6 h-6">
              <Icon
                type={"cross"}
                fill={darkMode ? "white" : "#1c274c"}
                className="mr-5 sm:block md:hidden cursor-pointer"
                onClick={() => {
                  dispatch(toggleThreadBar());
                  if (!threadBarOpen) {
                    if (sidebarOpen) dispatch(expandSidebar());
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
      {!threadBarOpen ? (
        <div
          className="flex justify-center mt-3 cursor-pointer"
          onClick={() => {
            dispatch(createNewSession({ botId }));
            dispatch(toggleState());
          }}
        >
          <BiSolidEdit
            width={16}
            height={16}
            className="dark:text-white text-label"
          />
        </div>
      ) : (
        <div
          className="cursor-pointer mx-4 flex items-center justify-center rounded-lg gap-3 py-3.5 shadow-[0_3px_4px_0_rgba(0,0,0,0.06)] mb-4 dark:bg-[#ffffff61] hover:brightness-90"
          onClick={() => {
            if (origin && origin == "home") {
              const newSessionKey = Math.random().toString(36).substring(2, 15);
              const botData = JSON.parse(localStorage.getItem(botId)) || {};
              botData.sessionKey = newSessionKey;
              localStorage.setItem(botId, JSON.stringify(botData));
              router.push(`/chat/${botId}`);
            } else {
              dispatch(createNewSession({ botId }));
              dispatch(toggleState());
              if (isMobile) {
                if (initialTab !== "/chat" && isMobile) {
                  router.push(`/chat/661cacc79657814effd8db6c`);
                }
                dispatch(toggleThreadBar());
                if (!threadBarOpen) {
                  if (sidebarOpen) dispatch(expandSidebar());
                }
              }
            }
          }}
        >
          <BiSolidEdit
            width={16}
            height={16}
            className="w-4 h-4 dark:text-white text-label"
          />
          <span className="text-label text-sm font-medium dark:text-white">
            Start a new thread
          </span>
        </div>
      )}

      {/* Thread Section */}
      {threadBarOpen && (
        <div className="overflow-y-scroll threads-content md:max-h-[calc(100vh-220px)] max-h-[calc(100vh-150px)]">
          {renderThreadSection()}
        </div>
      )}
      <style>
        {`
          .threads-content::-webkit-scrollbar {
            width: 8px;
          }

          .threads-content::-webkit-scrollbar-track {
            background: transparent;
          }

          .threads-content::-webkit-scrollbar-thumb {
            background: #e4e5ea;
            border-radius: 4px;
          }

          .threads-content::-webkit-scrollbar-thumb:hover {
            background: #e4e5ea;
          }
        `}
      </style>
    </div>
  );
};

export default Threads;
