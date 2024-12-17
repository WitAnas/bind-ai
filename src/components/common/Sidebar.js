"use client";

import moment from "moment";
import {
  expandSidebar,
  showPopup,
  toggleThreadBar,
} from "@/redux/reducers/commonReducer";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./login/LoginForm";
import { useClientMediaQuery } from "@/features/hooks";
import ProfileContainer from "./profile/ProfileContainer";
import PremiumPopup from "./premium/PremiumPopup";
import {
  getUserSubscriptionState,
  hasActivePremiumSubscription,
  isCanceledPremium,
} from "@/utils/subscription";
import CompanyForm from "./organisation/company/CompanyForm";
import Icon from "./Icon";
import { setGptAgent, setOpen } from "@/redux/reducers/codeEditorReducer";
import { handleConnectCarbon } from "@/features/chat/components/MessageContainer";

const SideBar = ({ sideMenu, setSidebarOpen }) => {
  const param = usePathname();
  const initialTab = "/" + param.split("/")[1];
  const [activeTab, setActiveTab] = useState(
    initialTab === "/chat" || initialTab === "/" ? 1 : 0
  );
  const open = useSelector((state) => state.code.open);
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.common.sidebarCollapsed);
  const threadBarOpen = useSelector((state) => state.common.threadBarOpen);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const loading = useSelector((state) => state.auth.loading);
  const userSubscription = useSelector((state) => state.userSubscription);
  const isMobile = useClientMediaQuery("(max-width: 600px)");
  const darkMode = useSelector((state) => state.theme.darkMode);
  const isOpen = isMobile ? true : sidebarOpen;
  const router = useRouter();

  const getActiveTab = (data) => {
    setActiveTab(data);
  };

  const authHandler = () => {
    if (!currentUser || Object.keys(currentUser).length === 0) {
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
    } else {
      dispatch(
        showPopup({
          title: "",
          description: <ProfileContainer userName={currentUser?.displayName} />,
          btnArray: [],
          classAdditions: {
            popupContainer: "md:w-1/3 w-12/12",
          },
        })
      );
    }
  };

  const filteredSideMenu = sideMenu.filter(
    (item) =>
      item.label !== "Try Premium" ||
      (!isCanceledPremium(userSubscription) &&
        currentUser?.uid &&
        !userSubscription?.loading &&
        !userSubscription?.sumo_data)
  );

  return (
    <div className="flex flex-col justify-between mr-2 mt-4 h-[80%] md:h-[92%] cursor-pointer">
      <div className="flex flex-col">
        {filteredSideMenu.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.link) {
                  if (item?.target) {
                    window.open(item.link, item?.target || "_self");
                  } else {
                    router.push(item.link);
                    if (item.link == "/") {
                      setSidebarOpen && setSidebarOpen(false);
                    }
                  }
                } else if (item.label === "Try Premium") {
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
                } else if (item.label === "Add Team Members") {
                  // router.push("/members")
                  dispatch(
                    showPopup({
                      title: "",
                      description: <CompanyForm />,
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
                } else if (
                  item.label === "Connect data" ||
                  item.label === "Integrations"
                ) {
                  handleConnectCarbon(
                    currentUser,
                    userSubscription,
                    open,
                    dispatch
                  );
                } else if (item.label === "My threads" && isMobile) {
                  if (isMobile) {
                    dispatch(toggleThreadBar());
                    if (!threadBarOpen) {
                      if (sidebarOpen) dispatch(expandSidebar());
                    }
                    setSidebarOpen && setSidebarOpen(false);
                  }
                } else if (item.label === "AI Studio") {
                  dispatch(setGptAgent(true));
                }
              }}
              className={`md:${item?.mobile && "hidden"}`}
            >
              <div
                key={item.id}
                className={`py-5 md:py-2.5 ${
                  item.id === activeTab
                    ? `${
                        isOpen
                          ? "text-white bg-darkMutedPurple py-2.5 rounded-r-lg"
                          : ""
                      }`
                    : "bg-transparent"
                } ${item?.className} ${
                  isOpen ? "pl-3 py-2.5" : "ml-3 py-2.5"
                } ${
                  isOpen
                    ? " hover:bg-darkMutedPurple hover:bg-opacity-80 hover:md:py-2.5 hover:rounded-r-lg hover:text-white"
                    : ""
                }`}
                onClick={() => getActiveTab(item.id)}
              >
                <div className="flex items-center">
                  <Image
                    src={`/images/${
                      item.id == activeTab && !darkMode
                        ? item?.activeIcon
                        : item.icon
                    }.png`}
                    alt={`${item.icon}`}
                    width={34}
                    height={34}
                    className={`block  hover:bg-darkMutedPurple hover:bg-opacity-80 rounded-lg ${
                      item.id === activeTab && !isOpen && "bg-darkMutedPurple"
                    }`}
                  />
                  {isOpen && (
                    <p
                      className={`label pl-2 font-semibold sm:text-base md:text-sm ${
                        item.label !== "Try Premium" && "dark:text-white"
                      }`}
                    >
                      {item.label}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-y-3 pl-3">
        <div
          className="hidden md:flex items-center"
          onClick={() => {
            dispatch(expandSidebar());
            if (!sidebarOpen) {
              threadBarOpen && dispatch(toggleThreadBar());
            }
          }}
        >
          {isOpen ? (
            <Icon
              type={"left-arrow"}
              width={16}
              height={16}
              fill={darkMode ? "#F2F3F4" : "#1C274C"}
              className="block ml-2"
            />
          ) : (
            <Icon
              type={"right-arrow"}
              width={16}
              height={16}
              fill={darkMode && "#F2F3F4"}
              className="block ml-2"
            />
          )}
        </div>
        <div className="flex items-center" onClick={() => authHandler()}>
          {!loading && (
            <>
              {currentUser && Object.keys(currentUser).length !== 0 ? (
                <Image
                  src={`/images/${
                    darkMode ? "darkModeSettings" : "settings"
                  }.png`}
                  alt={`settings`}
                  width={34}
                  height={34}
                  className="block"
                />
              ) : (
                <Image
                  src={`/images/signin.png`}
                  alt={`signin`}
                  width={34}
                  height={34}
                  className="block"
                />
              )}
              {isOpen && (
                <p className="label pl-2 font-semibold sm:text-base md:text-sm dark:text-white truncate">
                  {currentUser && Object.keys(currentUser).length !== 0
                    ? currentUser?.displayName
                    : "Sign in"}
                </p>
              )}
            </>
          )}
        </div>
        {isMobile && (
          <div className="absolute bottom-5 flex self-center h-[5px] w-[57px] bg-[#d0cdec] rounded-2xl"></div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
