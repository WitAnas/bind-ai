import LoginForm from "@/components/common/login/LoginForm";
import PremiumPopup from "@/components/common/premium/PremiumPopup";
import Button from "@/components/ui/Button";
import ToolTip from "@/components/ui/Tooltip";
import { setOpen } from "@/redux/reducers/codeEditorReducer";
import { showPopup } from "@/redux/reducers/commonReducer";
import {
  hasActivePremiumSubscription,
  hasActiveTrialSubscription,
} from "@/utils/subscription";
import Image from "next/image";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactTextareaAutosize from "react-textarea-autosize";
import InputModelPopup from "./InputModelPopup";
import { FaRegFolderOpen } from "react-icons/fa";
import { useClientMediaQuery } from "@/features/hooks";
import ModelCategoryContainer from "@/components/common/chat/ModelCategoryContainer";
import ApiKeyPopup from "@/components/common/apiKey/ApiKeyPopup";
import Icon from "@/components/common/Icon";
import SumoUsersLimitPopup from "@/features/sumo-app/components/SumoUsersLimitPopup";

export const handleConnectCarbon = (
  currentUser,
  userSubscription,
  open,
  dispatch
) => {
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
  } else if (
    userSubscription?.sumo_data &&
    !userSubscription?.sumo_data?.features?.carbon_integration?.is_available
  ) {
    dispatch(
      showPopup({
        title: "",
        description: (
          <SumoUsersLimitPopup
            feature={"integration"}
            h1={"Integrations"}
            h2={"to automate creation for you"}
            desc={
              <>
                Bind AI learns from your existing codebase and data, and <br />
                automatically provides personalized code and responses.
              </>
            }
            features={["GitHub", "Google Drive", "Manual File Upload"]}
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
  } else if (
    !hasActivePremiumSubscription(userSubscription) &&
    !userSubscription?.sumo_data
  ) {
    dispatch(
      showPopup({
        title: "",
        description: (
          <SumoUsersLimitPopup
            feature={"integration"}
            h1={"Integrations"}
            h2={"to automate creation for you"}
            desc={
              <>
                Bind AI learns from your existing codebase and data, and <br />
                automatically provides personalized code and responses.
              </>
            }
            features={["GitHub", "Google Drive", "Manual File Upload"]}
            ctaHeading={"Upgrade Now"}
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
  } else {
    dispatch(setOpen(!open));
  }
};

export const handleAdvancedModelClick = (
  currentUser,
  userSubscription,
  dispatch
) => {
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
  } else if (
    userSubscription?.sumo_data &&
    !userSubscription?.sumo_data?.features?.add_your_own_api_key?.is_available
  ) {
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
  } else if (
    !hasActivePremiumSubscription(userSubscription) &&
    !hasActiveTrialSubscription(userSubscription) &&
    !userSubscription?.sumo_data
  ) {
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
  } else {
    dispatch(
      showPopup({
        title: "",
        description: <ApiKeyPopup />,
        btnArray: [],
        classAdditions: {
          popupContainer: `
         w-[720px] 
        `,
          popup:
            " !w-full !border dark:border-[#ffffff1e] border-[#E4E5EA] dark:bg-[#26282c] p-7",
        },
      })
    );
  }
};

export const handleClick = (dispatch, name, value) => {
  dispatch(
    showPopup({
      title: "",
      description: (
        <ModelCategoryContainer
          category={{
            name: name,
            value: value,
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

const MessageContainer = memo(
  ({ handleSubmit, className, isTyping, apiError }) => {
    const [msg, setMsg] = useState("");
    const [openPopup, setOpenPopup] = useState(false);
    const inputRef = useRef();
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.theme.darkMode);
    const open = useSelector((state) => state.code.open);
    const currentUser = useSelector((state) => state.auth.currentUser);
    const userSubscription = useSelector((state) => state.userSubscription);
    const isMobile = useClientMediaQuery("(max-width: 600px)");

    useEffect(() => {
      inputRef.current.focus();
    }, []);

    const handleChange = useCallback(
      (e) => {
        setMsg(e.target.value);
      },
      [setMsg]
    );

    const handleKeyPress = useCallback(
      (e) => {
        if (e.key === "Enter" && !e.shiftKey && msg.trim() !== "") {
          if (!apiError && !isTyping) {
            e.preventDefault();
            handleSubmit(msg, setMsg);
          }
        }
      },
      [apiError, isTyping, handleSubmit, setMsg, msg]
    );

    const closePopup = () => {
      setOpenPopup(false);
    };

    return (
      <div className={`text-center ${className}`}>
        <div>
          <div
            className={`text-input !border-[3px] ${
              !darkMode && "!border-[#FFDAB3]"
            } relative flex bg-white dark:bg-darkTextArea !rounded-[10px] flex-col dark:border-darkPrimary `}
          >
            <ReactTextareaAutosize
              autoFocus
              ref={inputRef}
              className="w-full px-3 pt-3 mb-3 pb-0 max-h-[248px]  text-[#1C274C] font-normal rounded-lg dark:bg-darkTextArea dark:text-white"
              placeholder="Enter your message here"
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              value={msg}
            />

            {/* model select button */}
            <div className="relative">
              <div
                className={`dark:border-darkPrimary flex items-center justify-center gap-1.5 font-normal text-sm rounded-[4px] cursor-pointer  ${
                  openPopup
                    ? "dark:bg-white12 bg-[#e4e5ea80]"
                    : "dark:bg-transparent bg-white"
                }
             py-2.5 px-2 w-fit mb-2 ml-2 dark:hover:bg-white12 hover:bg-[#e4e5ea80]`}
                onClick={() => setOpenPopup(true)}
              >
                <div className="flex justify-center items-center gap-2">
                  <Icon
                    type={"advanced-icon"}
                    width={20}
                    height={20}
                    fill={"#ffe600"}
                    className="block"
                  />
                  <p className="font-normal text-sm text-primary dark:text-white truncate font-[Inter,sans-serif]">
                    Advanced
                  </p>
                </div>
                <Image
                  src={`${
                    darkMode
                      ? "/svgs/chevron-down.svg"
                      : "/images/chevron-down.png"
                  }`}
                  alt="Pick Models"
                  width={17}
                  height={17}
                />
              </div>
              {openPopup && (
                <InputModelPopup
                  heading={"Select a model"}
                  popupPosition={`  ${
                    isMobile &&
                    `left-1/2
                  bottom-0
                  -translate-y-1/2
                  -translate-x-1/2 `
                  } md:left-[150px] md:bottom-1.5`}
                  closePopup={closePopup}
                  width={"290px"}
                >
                  <div className=" flex flex-col mt-2">
                    <div
                      className="flex items-center hover:dark:bg-white12 hover:bg-[#e4e5ea] px-3 py-[10px] pl-4 cursor-pointer"
                      onClick={() => {
                        handleClick(
                          dispatch,
                          "Fast General Purpose",
                          "general_purpose"
                        );
                        setOpenPopup(false);
                      }}
                    >
                      <Icon
                        type={"basic-icon"}
                        width={20}
                        height={20}
                        fill={darkMode ? "#fff" : "#1C274C"}
                        className=" mr-2"
                      />

                      <span className=" text-primary font-medium font-[Inter] text-sm dark:text-white">
                        Basic{"  "}
                        <span className="dark:text-[#ffffff8a] font-normal">
                          {"   "}
                          (GPT 3.5 or similar)
                        </span>
                      </span>
                    </div>
                    <div
                      className="flex items-center hover:dark:bg-white12 hover:bg-[#e4e5ea] px-3 py-[10px] pl-4 cursor-pointer"
                      onClick={() => {
                        handleAdvancedModelClick(
                          currentUser,
                          userSubscription,
                          dispatch
                        );
                        setOpenPopup(false);
                      }}
                    >
                      <Icon
                        type={"advanced-icon"}
                        width={20}
                        height={20}
                        fill={"#ffe600"}
                        className=" mr-2"
                      />

                      <span className=" text-primary font-medium font-[Inter] text-sm dark:text-white">
                        Advanced{"   "}
                        <span className="dark:text-[#ffffff8a] font-normal">
                          (Add your API Key)
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#e4e5ea] dark:bg-[#ffffff13] h-[1px] mt-2 mx-3"></div>
                </InputModelPopup>
              )}
            </div>

            <div className="flex gap-4 absolute right-4 bottom-2.5">
              <Image
                src={`/images/${
                  darkMode ? "darkModeAttachment" : "attachment"
                }.png`}
                alt="attachment"
                width={23}
                height={23}
                className="block cursor-pointer"
                onClick={() =>
                  handleConnectCarbon(
                    currentUser,
                    userSubscription,
                    open,
                    dispatch
                  )
                }
              />
              <Button
                variant="link"
                icon="/svgs/send-button.svg"
                onlyIcon
                onClick={() => {
                  handleSubmit(msg, setMsg);
                }}
                disabled={apiError || isTyping}
              />
            </div>
          </div>
        </div>
        <div className="sm:block md:hidden flex justify-between items-center my-2">
          <div className="flex items-center">
            <p className={`text-xs mr-1 dark:text-[#F2F3F4]`}>
              Created with Bind
            </p>
            <Image
              src={`/images/bind-logo.png`}
              alt={"bind-logo"}
              width={18}
              height={18}
              className={`block mr-3`}
            />
          </div>
          <p className="text-[10px] text-label dark:text-[#F2F3F4]">
            Always check its answers.
            <span className="text-black dark:text-white">Privacy</span> in Bind
          </p>
        </div>
        <p className="hidden md:block text-[10px] text-label mt-1 dark:text-[#848a9e] font-[Inter]">
          Bind can provide inaccurate information, including about people.
          Always double-check its answers. Your privacy in Bind
        </p>
        <style>
          {`
          .text-input{
            border-radius: 6px;
            border: 1px solid rgb(228, 229, 234);
            box-shadow: 0px 2px 4px 0px rgba(28, 39, 76, 0.07);
            box-sizing: border-box;
          }
            
          textarea:focus,textarea {
            outline: none;
            resize:none;
          }

          textarea::-webkit-scrollbar {
            width: 5px;
          }
          
          textarea::-webkit-scrollbar-track {
            background-color: transparent; 
          }
          
          textarea::-webkit-scrollbar-thumb {
            background-color: #E4E5EA;
            border-radius: 3px solid;
            border: 6px
          }
          
          textarea::-webkit-scrollbar-thumb:hover {
            background-color:#E4E5EA; 
          }
         
          textarea {
            scrollbar-width: thin; 
            scrollbar-color: #E4E5EA transparent;
          }
          `}
        </style>
      </div>
    );
  }
);

MessageContainer.displayName = "MessageContainer";

export default MessageContainer;
