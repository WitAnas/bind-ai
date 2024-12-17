"use client";

import Content from "@/components/common/Content";
// import SideBar from "@/components/common/Sidebar";
import Logo from "@/components/ui/Logo";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoaderSkeleton from "../loading";
import SidebarConfig from "@/config/SidebarConfig";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Popup from "@/components/common/Popup";
import {
  hidePopup,
  showPopup,
  showToaster,
} from "@/redux/reducers/commonReducer";
import Toaster from "@/components/ui/Toaster";
import Image from "next/image";
import MobileHeader from "@/components/common/MobileHeader";
import { useClientMediaQuery } from "@/features/hooks";
import SubscriptionButton from "@/components/common/premium/SubscriptionButton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SuccessSubPopup from "@/components/common/premium/SuccessSubPopup";
import dynamic from "next/dynamic";
import PremiumPopup from "@/components/common/premium/PremiumPopup";
import {
  hasActivePremiumSubscription,
  hasActiveTrialSubscription,
} from "@/utils/subscription";
import { getDealsNavButtonProps, removeQueryParam } from "@/utils";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import ThemeToggle from "@/components/common/ThemeToggle";
import RightSidebar from "@/components/common/RightSidebar";
import Icon from "@/components/common/Icon";
import { updateIsLoggedIn } from "@/redux/reducers/authReducer";
import FreeTierPopup from "@/components/common/premium/FreetierPopup";
import ModelCategoryContainer from "@/components/common/chat/ModelCategoryContainer";
import {
  handleAdvancedModelClick,
  handleConnectCarbon,
} from "@/features/chat/components/MessageContainer";

import {
  setGptAgent,
  setIsCreatingAgent,
} from "@/redux/reducers/codeEditorReducer";
import LoginForm from "@/components/common/login/LoginForm";
import SumoUsersLimitPopup from "@/features/sumo-app/components/SumoUsersLimitPopup";
import FridaySalePopup from "@/components/common/deals/FridaySalePopup";
import DealsNavButton from "@/components/common/chat/DealsNavButton";
const SideBar = dynamic(() => import("@/components/common/Sidebar"), {
  ssr: false,
});
const CarbonConnectComponent = dynamic(
  () => import("@/components/common/canvas/CarbonConnectComponent"),
  {
    ssr: false,
  }
);

export const handleDealsNavButtonClick = (dispatch) => {
  dispatch(
    showPopup({
      title: "",
      description: <FridaySalePopup deal={"cyberMonday"} />,
      btnArray: [],
      classAdditions: {
        popupContainer: `
 w-[750px] 
`,
        popup:
          " !w-full !border dark:border-[#ffffff1e] border-[#E4E5EA] dark:bg-[#26282c] py-7",
      },
    })
  );
};

export default function HomeLayout({ children }) {
  const routeConfig = {
    routes: SidebarConfig(),
  };
  const common = useSelector((state) => state.common);
  const userSubscription = useSelector((state) => state.userSubscription);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isMobile = useClientMediaQuery("(max-width: 600px)");
  const loading = useSelector((state) => state.auth.loading);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const open = useSelector((state) => state.code.open);

  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    dispatch(
      showPopup({
        title: "",
        description: (
          <ModelCategoryContainer
            category={{
              name: "All",
              value: "all",
            }}
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

  useEffect(() => {
    if (!loading && !userSubscription.loading) {
      const paymentSuccess = params.get("paymentSuccess");
      const paymentFailed = params.get("paymentFailed");
      const state = params.get("state");
      const action = params.get("action");
      const feature = params.get("feature");
      const offer = params.get("offer");

      if (paymentSuccess == "true") {
        // window.history.replaceState(null, "", window.location.pathname);
        if (currentUser?.uid) {
          if (userSubscription?.user_info) {
            setDoc(doc(db, "userSubscription", currentUser?.uid), {
              ...userSubscription?.user_info,
            });
          }
          removeQueryParam("paymentSuccess", router, params, pathname);
          dispatch(
            showPopup({
              title: "",
              description: <SuccessSubPopup />,
              btnArray: [],
              classAdditions: {
                popupContainer: "md:w-[30%] w-11/12",
              },
            })
          );
        }
      } else if (paymentFailed || paymentSuccess) {
        window.history.replaceState(null, "", window.location.pathname);
      } else if (state === "subscribe") {
        if (currentUser?.uid) {
          // window.history.replaceState(null, "", window.location.pathname);
          removeQueryParam("state", router, params, pathname);
        }
        if (hasActivePremiumSubscription(userSubscription)) {
          dispatch(
            showToaster({
              variant: "success",
              title: "You already are a Subscriber",
              description: "",
            })
          );
        } else if (hasActiveTrialSubscription(userSubscription)) {
          dispatch(
            showToaster({
              variant: "success",
              title: "You already have an active Trial",
              description: "",
            })
          );
        } else {
          if (
            userSubscription?.user_info?.subscription_plan == "" &&
            userSubscription?.user_info?.subscription_type == "Free" &&
            userSubscription?.user_info?.subscription_status == "canceled"
          ) {
            dispatch(
              showToaster({
                variant: "success",
                title: "You already used your trial, subscribe to continue",
                description: "",
              })
            );
          }
          dispatch(
            showPopup({
              title: "",
              description: <PremiumPopup />,
              btnArray: [],
              classAdditions: {
                popupContainer: `
                w-full md:w-[28%] h-[90%] md:h-auto rounded-t-2xl
              `,
                popup: "h-screen !rounded-none w-full md:h-auto md:!rounded-lg",
                additional: `fixed md:relative bottom-0`,
              },
            })
          );
        }
      } else if (offer) {
        if (currentUser?.uid) {
          removeQueryParam("offer", router, params, pathname);
        }

        if (
          offer == "black-friday" &&
          !userSubscription?.sumo_data &&
          userSubscription?.user_info?.subscription_plan !=
            process.env.NEXT_PUBLIC_ANNUAL_SCALE_PLAN
        ) {
          dispatch(
            showPopup({
              title: "",
              description: <FridaySalePopup />,
              btnArray: [],
              classAdditions: {
                popupContainer: `
                 w-[750px] 
                `,
                popup:
                  " !w-full !border dark:border-[#ffffff1e] border-[#E4E5EA] dark:bg-[#26282c] py-7",
              },
            })
          );
        } else if (
          offer == "holiday-sale" &&
          !userSubscription?.sumo_data &&
          userSubscription?.user_info?.subscription_plan !=
            process.env.NEXT_PUBLIC_ANNUAL_SCALE_PLAN
        ) {
          dispatch(
            showPopup({
              title: "",
              description: <FridaySalePopup deal={"cyberMonday"} />,
              btnArray: [],
              classAdditions: {
                popupContainer: `
                     w-[750px] 
                    `,
                popup:
                  " !w-full !border dark:border-[#ffffff1e] border-[#E4E5EA] dark:bg-[#26282c] py-7",
              },
            })
          );
        }
      } else if (feature) {
        if (currentUser?.uid) {
          removeQueryParam("feature", router, params, pathname);
        }

        if (feature == "integrations") {
          handleConnectCarbon(currentUser, userSubscription, open, dispatch);
        } else if (feature == "custom_gpt") {
          dispatch(setGptAgent(true));
        } else if (feature == "create_gpt") {
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
          } else if (
            !userSubscription?.sumo_data?.tier &&
            userSubscription?.sumo_data
          ) {
            dispatch(
              showPopup({
                title: "",
                description: (
                  <SumoUsersLimitPopup
                    feature={"gptagent"}
                    h1={"You have reached the limit"}
                    h2={"for current Tier"}
                    desc={
                      <>
                        Streamline your chat with agents for code generation,
                        website
                        <br /> creation, HTML emails, and many more.
                      </>
                    }
                    features={[
                      "Code Generation",
                      "Website Creation",
                      "Creative tasks",
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
                  popupContainer: `
               w-[510px] 
              `,
                  popup:
                    " !w-full !border dark:border-[#ffffff1e] dark:bg-[#26282c] px-7",
                },
              })
            );
            return;
          } else if (
            (userSubscription?.sumo_data?.tier == 1 &&
              filteredBotsCount >= 1) ||
            (userSubscription?.sumo_data?.tier == 2 && filteredBotsCount >= 5)
          ) {
            dispatch(
              showPopup({
                title: "",
                description: (
                  <SumoUsersLimitPopup
                    feature={"gptagent"}
                    h1={"You have reached the limit"}
                    h2={"for current Tier"}
                    desc={
                      <>
                        Streamline your chat with agents for code generation,
                        website
                        <br /> creation, HTML emails, and many more.
                      </>
                    }
                    features={[
                      "Code Generation",
                      "Website Creation",
                      "Creative tasks",
                    ]}
                    ctaHeading={"Upgrade to Next Tier"}
                  />
                ),
                btnArray: [],
                classAdditions: {
                  popupContainer: `
               w-[510px] 
              `,
                  popup:
                    " !w-full !border dark:border-[#ffffff1e] dark:bg-[#26282c] px-7",
                },
              })
            );
            return;
          } else if (
            !hasActivePremiumSubscription(userSubscription) &&
            !hasActiveTrialSubscription(userSubscription) &&
            !userSubscription?.sumo_data
          ) {
            dispatch(
              showPopup({
                title: "",
                description: (
                  <SumoUsersLimitPopup
                    feature={"gptagent"}
                    h1={"Custom Agents"}
                    h2={"to automate creation for you"}
                    desc={
                      <>
                        Streamline your chat with agents for code generation,
                        website
                        <br /> creation, HTML emails, and many more.
                      </>
                    }
                    features={[
                      "Code Generation",
                      "Website Creation",
                      "Creative tasks",
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
                  popupContainer: `
               w-[510px] 
              `,
                  popup:
                    " !w-full !border dark:border-[#ffffff1e] dark:bg-[#26282c] px-7",
                },
              })
            );
            return;
          }
          dispatch(setIsCreatingAgent(true));
          dispatch(setGptAgent(true));
        }
      } else if (
        isLoggedIn &&
        !loading &&
        !userSubscription.loading &&
        !hasActivePremiumSubscription(userSubscription) &&
        !hasActiveTrialSubscription(userSubscription)
      ) {
        dispatch(
          showPopup({
            title: "",
            description: (
              <FreeTierPopup
                heading="Introducing GPT-4o"
                icon="bind1"
                desc="We're giving you limited access to Open AI's most advanced model. You can try Claude, Cohere, Mistral and other models. "
                buttonText="Explore all Models"
                text="Learn More"
                handleClick={handleClick}
                handleTextClick={() => {
                  window.open(
                    "https://blog.getbind.co/2024/05/13/introducing-bind-ai-premium-access-claude-3-opus-gpt-4-cohere-command-r-in-a-single-interface/",
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
        dispatch(updateIsLoggedIn(false));
      } else if (isLoggedIn) {
        dispatch(updateIsLoggedIn(false));
      } else if (action == "addkey") {
        if (currentUser?.uid) {
          removeQueryParam("action", router, params, pathname);
        }
        // dispatch(
        //   showPopup({
        //     title: "",
        //     description: <ApiKeyPopup />,
        //     btnArray: [],
        //     classAdditions: {
        //       popupContainer: `
        //      w-[720px] 
        //     `,
        //       popup:
        //         " !w-full !border dark:border-[#ffffff1e] border-[#E4E5EA] dark:bg-[#26282c] p-7",
        //     },
        //   })
        // );
      }
    }
  }, [loading, userSubscription.loading]);

  return (
    <>
      <div className="h-screen bg-primary dark:bg-darkPrimary overflow-hidden">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center gap-6">
            <Logo
              width={100}
              height={100}
              className="pb-6 pt-4 pl-4"
              childClass={"w-[120px] h-[30px] block"}
            />
            {(userSubscription?.user_info || userSubscription.sumo_data) && (
              <div className={`${isMobile && "hidden"}`}>
                <SubscriptionButton userSubscription={userSubscription} />
              </div>
            )}
          </div>
          <div className="flex items-center mr-4">
            <CarbonConnectComponent />
            <Button
              variant="link"
              className="hidden md:block mr-[30px]"
              onClick={() =>
                window.open(
                  `${"https://bind-ai.gitbook.io/docs/"}`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <span className="dark:text-white">Documentation</span>
            </Button>
            <Button
              variant="link"
              className="hidden md:block mr-[30px]"
              onClick={() =>
                window.open(
                  `${
                    process.env.NEXT_PUBLIC_BIND_BASE_LINK ||
                    "https://www.getbind.co"
                  }/support`,
                  "_blank"
                )
              }
            >
              <span className="dark:text-white">Contact Us</span>
            </Button>
            {/* {!isMobile && (
              // <Button
              //   variant="primary"
              //   size="medium"
              //   className="mr-4 !bg-darkMutedPurple"
              //   onClick={() =>
              //     window.open(
              //       process.env.NEXT_PUBLIC_CREATE_AI_BOT_LINK ||
              //         "https://app.getbind.co/?utm_source=top-nav&utm_medium=canvas&utm_campaign=create_AI_copilot",
              //       "_blank"
              //     )
              //   }
              // >
              //   Create AI Bot
              // </Button>
              <Button
                variant="primary"
                size="medium"
                className="mr-4 !bg-darkMutedPurple hover:brightness-110 transition-all duration-200 ease-in-out"
                onClick={() =>
                  handleAdvancedModelClick(
                    currentUser,
                    userSubscription,
                    dispatch
                  )
                }
              >
                Add API Keys
              </Button>
            )} */}
            <div className="flex justify-between items-center mr-6">
              {!isMobile && (
                <span className="mr-2 text-black dark:text-white text-sm font-semibold">
                  Dark mode
                </span>
              )}
              <ThemeToggle />
            </div>
            {!isMobile && !loading && !userSubscription.loading && (
              // (!userSubscription?.sumo_data &&
              // userSubscription?.user_info?.subscription_plan !=
              //   process.env.NEXT_PUBLIC_ANNUAL_SCALE_PLAN ? (
              //   <DealsNavButton
              //     buttonText={
              //       getDealsNavButtonProps(
              //         userSubscription?.user_info?.subscription_plan,
              //         "cyberMonday"
              //       ).buttonText
              //     }
              //     deal={
              //       getDealsNavButtonProps(
              //         userSubscription?.user_info?.subscription_plan,
              //         "cyberMonday"
              //       ).deal
              //     }
              //     handleDealsNavButtonClick={() => {
              //       handleDealsNavButtonClick(dispatch);
              //     }}
              //   />
              // ) : (
              //   <Button
              //     variant="primary"
              //     size="medium"
              //     className="mr-4 !bg-darkMutedPurple hover:brightness-110 transition-all duration-200 ease-in-out"
              //     onClick={() =>
              //       handleAdvancedModelClick(
              //         currentUser,
              //         userSubscription,
              //         dispatch
              //       )
              //     }
              //   >
              //     Add API Keys
              //   </Button>
              // ))
              <Button
                variant="primary"
                size="medium"
                className="mr-4 !bg-darkMutedPurple hover:brightness-110 transition-all duration-200 ease-in-out"
                onClick={() =>
                  handleAdvancedModelClick(
                    currentUser,
                    userSubscription,
                    dispatch
                  )
                }
              >
                Add API Keys
              </Button>
            )}

            <Icon
              type={"hamburger"}
              fill={darkMode && "white"}
              width={24}
              height={24}
              className="mr-2 sm:block md:hidden cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>
        </div>
        <div className="flex h-[calc(100%-70px)]">
          <div
            className={`hidden md:block ${
              common.sidebarCollapsed ? "w-1/6" : "w-[62px]"
            }`}
          >
            <SideBar sideMenu={routeConfig?.routes} />
          </div>
          <div
            className={`${
              common.sidebarCollapsed ? "md:w-5/6" : "md:w-[calc(100%-62px)]"
            } w-full`}
          >
            <Suspense fallback={<LoaderSkeleton />} />
            <Content>{children}</Content>
            <Popup
              open={common.popup.visible}
              messageData={common.popup.messageData}
              classAdditions={common.popup.classAdditions}
              closePopup={() => {
                dispatch(hidePopup());
              }}
            />
            <Toaster
              open={common.toaster.visible}
              messageData={common.toaster.messageData}
            />
            {sidebarOpen && (
              <div className="sm:block md:hidden">
                <div class="fixed top-0 left-0 bg-black bg-opacity-10 h-full w-full overflow-auto bg-black-500/100"></div>
                <div className="absolute top-0 bg-primary dark:bg-darkPrimary h-screen rounded-b-2xl w-full z-20">
                  {" "}
                  <MobileHeader onClick={() => setSidebarOpen(!sidebarOpen)} />
                  {/* <div className="flex justify-between items-center">
                  <Logo width={95} height={30} className="py-6 pl-4" />
                  <Image
                      src={`/images/cross.png`}
                      alt={"menu"}
                      width={24}
                      height={24}
                      className="mr-5 sm:block md:hidden cursor-pointer"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                    />
                </div> */}
                  <SideBar
                    sideMenu={routeConfig?.routes}
                    setSidebarOpen={setSidebarOpen}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
