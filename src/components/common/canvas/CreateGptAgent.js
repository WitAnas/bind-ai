import Input from "@/components/ui/Input";
import React, { useEffect, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { MdErrorOutline } from "react-icons/md";
import Button from "@/components/ui/Button";
import Icon from "../Icon";

import { showPopup, showToaster } from "@/redux/reducers/commonReducer";
import { useDispatch, useSelector } from "react-redux";
import GptAgentSuccessPopup from "./GptAgentSuccessPopup";
import { FaFileUpload } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { HiMiniChevronUpDown } from "react-icons/hi2";
import { fetchUserBots } from "@/redux/reducers/botReducer";
import { createUserCustomBot, updateUserCustomBot } from "@/utils";
import { handleConnectCarbon } from "@/features/chat/components/MessageContainer";
import LoginForm from "../login/LoginForm";
import PremiumPopup from "../premium/PremiumPopup";
import {
  hasActivePremiumSubscription,
  hasActiveTrialSubscription,
} from "@/utils/subscription";
import SumoUsersLimitPopup from "@/features/sumo-app/components/SumoUsersLimitPopup";

const CreateGptAgent = ({
  initialData,
  mode = "create",
  onComplete,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useSelector((state) => state.auth.currentUser);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const open = useSelector((state) => state.code.open);
  const userSubscription = useSelector((state) => state.userSubscription);
  const bots = useSelector((state) => state.bot.bots);
  const filteredBotsCount = bots?.filter(
    (bot) => bot?.bname !== "Custom Bot"
  )?.length;

  const dispatch = useDispatch();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      initialData?.bname && setName(initialData.bname);
      initialData?.base && setDescription(initialData.base);
      initialData?.prompt && setPrompt(initialData.prompt);
    }
  }, [initialData, mode]);

  const validateForm = () => {
    let formErrors = {};
    if (!name.trim()) formErrors.name = "Name is required";
    if (!description.trim()) formErrors.description = "Description is required";
    if (!prompt.trim()) formErrors.prompt = "System prompt is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleCreateAgent = async () => {
    if (!validateForm()) return;

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
                  Streamline your chat with agents for code generation, website
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
                  : userSubscription?.user_info?.trial_available === true ||
                    userSubscription?.user_info?.trial_available === "true"
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
      (userSubscription?.sumo_data?.tier == 1 && filteredBotsCount >= 1) ||
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
                  Streamline your chat with agents for code generation, website
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
                  Streamline your chat with agents for code generation, website
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
                  : userSubscription?.user_info?.trial_available === true ||
                    userSubscription?.user_info?.trial_available === "true"
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

    setIsLoading(true);
    try {
      const botResponse = await createUserCustomBot(
        currentUser?.uid,
        "",
        name,
        description,
        prompt,
        currentUser?.email
      );
      if (botResponse) {
        setName("");
        setDescription("");
        setPrompt("");
        dispatch(
          showPopup({
            title: "",
            description: <GptAgentSuccessPopup botId={botResponse?.id} />,
            btnArray: [],
            classAdditions: {
              popupContainer: `md:w-[580px]  w-[95%]

            `,
              popup:
                " !w-full !border dark:border-[#ffffff1e] border-[#E4E5EA] dark:bg-[#26282c] p-7",
            },
          })
        );
        dispatch(fetchUserBots(currentUser?.uid));
        onComplete?.();
      } else {
        dispatch(
          showToaster({
            variant: "error",
            title: "Failed to create GPT agent. Please try again.",
            description: "",
          })
        );
      }
    } catch (error) {
      console.log("Error creating agent: ", error);
      dispatch(
        showToaster({
          variant: "error",
          title: "Failed to create GPT agent. Please try again.",
          description: "",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAgent = async () => {
    if (!validateForm()) return;

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

    if (mode === "edit" && initialData && initialData.id) {
      setIsLoading(true);
      try {
        const botResponse = await updateUserCustomBot(
          initialData.id,
          "",
          name,
          description,
          prompt
        );
        if (botResponse) {
          dispatch(
            showToaster({
              variant: "success",
              title: "GPT Agent updated successfully",
              description: "",
            })
          );
          dispatch(fetchUserBots(currentUser?.uid));
          onComplete?.();
        } else {
          dispatch(
            showToaster({
              variant: "error",
              title: "Failed to update GPT agent. Please try again.",
              description: "",
            })
          );
        }
      } catch (error) {
        console.log("Error editing agent: ", error);
        dispatch(
          showToaster({
            variant: "error",
            title: "Failed to update GPT agent. Please try again.",
            description: "",
          })
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      onComplete?.();
    }
  };

  return (
    <div className="relative h-full">
      <div className="bg-[#fafbfd] dark:bg-[#171719] pt-5 relative w-full">
        <div className="inner-content md:scale-[0.90]">
          <h1 className="text-2xl font-[Inter,sans-serif] font-semibold dark:text-white text-primary ">
            {mode === "edit" ? "Edit GPT Agent" : "Create custom GPT Agent"}
          </h1>
          <p className="dark:text-white text-primary text-base font-normal mt-2 ">
            {mode === "edit"
              ? "Modify your existing GPT agent"
              : "A new experience that allows you to create your own custom bots"}
          </p>

          {/* form content  */}
          <div className="mt-7   max-h-[calc(100vh-220px)] overflow-y-scroll form-content">
            <div className="flex flex-col gap-2">
              <h3 className="text-base text-primary dark:text-white font-medium">
                Name of GPT Agent
              </h3>
              <Input
                type="text"
                placeholder="Name"
                inputStyle={`placeholder:font-[400] placeholder:font-[Inter] placeholder:text-darkLabel dark:placeholder:text-[#ffffff8a]  outline-none  font-normal rounded-lg dark:bg-white12 text-primary dark:text-white !text-base w-full !shadow-none
                  ${
                    errors.name
                      ? "!border !border-[#9e1c1c] !bg-[#fcf8f8] dark:!bg-[#e0425d14] "
                      : "!border dark:!border-[#ffffff23] !border-lightBorder"
                  }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors?.name}
              />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <h3 className="text-base text-primary dark:text-white font-medium ">
                Description
              </h3>
              <Input
                type="text"
                placeholder="GPT which writes a blog post"
                inputStyle={`placeholder:font-[400] placeholder:font-[Inter] placeholder:text-darkLabel dark:placeholder:text-[#ffffff8a]  outline-none  font-normal rounded-lg dark:bg-white12 text-primary dark:text-white !text-base  w-full !shadow-none
                   ${
                     errors.description
                       ? "!border !border-[#9e1c1c] !bg-[#fcf8f8] dark:!bg-[#e0425d14] "
                       : "!border dark:!border-[#ffffff23] !border-lightBorder"
                   }`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors?.description}
              />
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base text-primary dark:text-white font-medium ">
                  Add System Prompt
                </h3>
                <MdErrorOutline size={17} className="text-darkLabel" />
              </div>

              <ReactTextareaAutosize
                className={`px-3.5 pt-6 placeholder:font-[400] max-h-[228px] min-h-[228px] placeholder:font-[Inter] placeholder:text-darkLabel dark:placeholder:text-[#ffffff8a]  outline-none  font-normal rounded-lg dark:bg-white12 text-primary dark:text-white !text-base w-full bg-white
                   ${
                     errors.prompt
                       ? "!border !border-[#9e1c1c] !bg-[#fcf8f8] dark:!bg-[#e0425d14] "
                       : "!border dark:!border-[#ffffff23] !border-lightBorder "
                   } 
                  `}
                placeholder={`Provide a system instructions or a prompt which will always be included. 
You can define the tone of responses, or ask the LLM to only use provided data or information to provide a response.
E.g. You can ask LLM to only respond in a JSON, or only respond with a Poem.`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              {errors.prompt && (
                <p className="text-red-500 text-sm mt-[-4px]">
                  {errors.prompt}
                </p>
              )}
            </div>

            {/* connect your data  */}
            <div className="mt-9">
              <h3 className="text-base text-primary dark:text-white font-medium ">
                Connect your Data Source
              </h3>
              <div className="mt-4 flex items-center gap-3">
                <div
                  className=" dark:bg-white12  dark:border-[#ffffff23] relative flex-1 pt-[18px] pb-3 flex flex-col items-center justify-center border border-lightBorder rounded-lg bg-white gap-3 hover:bg-[#faf9ff] hover:dark:border-[#745ffb] hover:border-[#745ffb]"
                  onClick={() =>
                    handleConnectCarbon(
                      currentUser,
                      userSubscription,
                      open,
                      dispatch
                    )
                  }
                >
                  <div className="absolute right-2.5 top-1.5">
                    <Icon
                      type={"premium-icon"}
                      width={100}
                      height={100}
                      fill={"#745ffb"}
                      className=" w-5 h-5 "
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <FaFileUpload
                      size={16}
                      className="dark:text-white text-primary w-4 h-4"
                    />

                    <span className="text-primary text-sm font-medium dark:text-white">
                      Upload file
                    </span>
                  </div>
                  <p className="text-darkLabel font-normal text-sm">
                    Max file size 20 MB
                  </p>
                </div>
                <div
                  className=" dark:bg-white12  dark:border-[#ffffff23]   relative flex-1 pt-[18px] pb-3 flex flex-col items-center justify-center border border-lightBorder rounded-lg bg-white hover:bg-[#faf9ff] hover:dark:border-[#745ffb] hover:border-[#745ffb] gap-3 "
                  onClick={() =>
                    handleConnectCarbon(
                      currentUser,
                      userSubscription,
                      open,
                      dispatch
                    )
                  }
                >
                  <div className="absolute right-2.5 top-1.5">
                    <Icon
                      type={"premium-icon"}
                      width={100}
                      height={100}
                      fill={"#745ffb"}
                      className=" w-[20px] h-[20px] "
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <IoMdAddCircle
                      size={20}
                      height={20}
                      width={20}
                      className="dark:text-white text-primary w-[20px] h-[20px]"
                    />

                    <span className="text-primary text-sm font-medium dark:text-white">
                      Connect Integrations
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Icon
                      type={"github-icon"}
                      width={21}
                      height={21}
                      className=" w-[21px] h-[21px] "
                      fill={darkMode}
                    />{" "}
                    <Icon
                      type={"drive-icon"}
                      width={21}
                      height={21}
                      className=" w-[21px] h-[21px] "
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* select default model div */}
            {/* <div className="mt-16">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base text-primary dark:text-white font-medium ">
                  Add System Prompt
                </h3>
                <MdErrorOutline size={17} className="text-darkLabel" />
              </div>
              <div className=" dark:bg-white12  dark:!border-[#ffffff23] mt-2 rounded-lg border border-lightBorder bg-white py-3.5 flex items-center w-fit px-4 hover:brightness-95 ">
                <Icon
                  type={"advanced-icon"}
                  width={19}
                  height={19}
                  fill={"#745ffb"}
                  className=" mr-2"
                />

                <span className=" text-primary font-medium font-[Inter] text-sm dark:text-white mr-1.5">
                  Advanced{"   "}
                  <span className="dark:text-[#ffffff8a]  text-darkLabel font-normal text-sm">
                    (Claude 3.5 Sonnet)
                  </span>
                </span>

                <HiMiniChevronUpDown
                  size={100}
                  height={20}
                  width={20}
                  className="dark:text-white text-label w-[20px] h-[20px]"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* bottom content */}
      <div className="w-full bg-[#fbfbfc] dark:bg-[#171719] border-t border-r-lightBorder dark:border-[#ffffff23] absolute bottom-0 flex items-center py-5 max-h-[70px]">
        <div className="inner-content md:scale-[0.90] pl-6 flex gap-4">
          <Button
            variant="primary"
            size="medium"
            className=" !bg-darkMutedPurple !px-10 !py-5 !rounded-lg flex items-center gap-1.5 hover:brightness-90 "
            onClick={() => {
              if (mode === "edit" && initialData && initialData?.id) {
                handleEditAgent();
              } else {
                handleCreateAgent();
              }
            }}
            disabled={isLoading}
          >
            <Icon
              type={"premium-icon"}
              width={100}
              height={100}
              fill={"white"}
              className=" w-[22px] h-[22px] "
            />
            <span className="text-white text-base font-medium">
              {isLoading
                ? mode === "edit"
                  ? "Saving..."
                  : "Creating..."
                : mode === "edit"
                ? "Save GPT Agent"
                : "Create agent"}
            </span>
          </Button>
          <Button
            variant="secondary"
            size="medium"
            className="!px-10 !py-5 !rounded-lg hover:brightness-90  dark:!bg-darkBotPrimary font-[Inter] dark:!text-white !text-base !border dark:!border-[#ffffff23] !border-lightBorder"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
      <style>
        {`
          .inner-content {
            transform-origin: top;
          }

          .form-content::-webkit-scrollbar {
            width: 8px;
          }

          .form-content::-webkit-scrollbar-track {
            background: transparent;
          }

          .form-content::-webkit-scrollbar-thumb {
            background: #e4e5ea;
            border-radius: 4px;
          }

          .form-content::-webkit-scrollbar-thumb:hover {
            background: #e4e5ea;
          }

          .form-content {
            padding-right: 16px;
            margin-right: -16px;
          }
        `}
      </style>
    </div>
  );
};

export default CreateGptAgent;
