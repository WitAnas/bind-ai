import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import { MdDelete, MdError } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { decryptApiKey, encryptApiKey } from "@/utils";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../Icon";
import { FaSave } from "react-icons/fa";
import { showPopup, showToaster } from "@/redux/reducers/commonReducer";
import { fetchUserApiKeys } from "@/redux/reducers/apiKeyReducer";
import {
  hasActivePremiumSubscription,
  hasActiveTrialSubscription,
} from "@/utils/subscription";
import LoginForm from "../login/LoginForm";
import PremiumPopup from "../premium/PremiumPopup";

const AddKeyForm = ({
  title,
  description,
  imageUrl,
  onInputChange,
  isOpen,
  onToggle,
  existingKeyData,
  onDelete,
}) => {
  const [key, setKey] = useState("");
  const [keyName, setKeyName] = useState(
    title == "Claude API Key" ? "Anthropic" : "OpenAI"
  );
  const [isSaved, setIsSaved] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userSubscription = useSelector((state) => state.userSubscription);
  const dispatch = useDispatch();
  const VALID_PROVIDERS = [
    "OpenAI",
    "Cohere",
    "Groq",
    "BindAI",
    "Mistral",
    "Anthropic",
  ];

  useEffect(() => {
    if (existingKeyData) {
      const decryptKey = existingKeyData.api_key
        ? decryptApiKey(existingKeyData.api_key)
          ? decryptApiKey(existingKeyData.api_key)
          : existingKeyData.api_key
        : "";
      setKey(decryptKey);
      setKeyName(existingKeyData.provider_name);
      setIsSaved(true);
    } else {
      setKey("");
      // setKeyName("");
      setIsSaved(false);
    }
  }, [existingKeyData]);

  useEffect(() => {
    if (!isOpen) {
      setTestStatus(null);
      setShowDeleteConfirm(false);
    }
  }, [isOpen]);

  const handleKeyChange = (e) => {
    setKey(e.target.value);
    if (e.target.value != "") {
      onInputChange(true);
    } else {
      onInputChange(false);
    }
  };

  // const handleKeyNameChange = (e) => {
  //   setKeyName(e.target.value);
  //   if (e.target.value != "") {
  //     onInputChange(true);
  //   } else if (!key) {
  //     onInputChange(false);
  //   }
  // };

  const handleSave = async () => {
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
      userSubscription?.sumo_data?.tier == 1 ||
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
      return;
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
      return;
    }

    if (!VALID_PROVIDERS.includes(keyName)) {
      dispatch(
        showToaster({
          variant: "error",
          title: `You can only add keys for the following providers: ${VALID_PROVIDERS.join(
            ", "
          )}. Please check the provider name and try again.`,
          description: ``,
        })
      );
      return;
    }
    setIsLoading(true);
    const encryptedKey = encryptApiKey(key);

    let formData = new FormData();

    const provider_info = {
      provider_name: keyName,
      api_key: encryptedKey,
      is_default: true,
    };

    formData.append("user_id", currentUser?.uid);
    formData.append("provider_info", JSON.stringify(provider_info));

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/user_key",
        formData
      );
      if (response.status === 200) {
        if (response.data?.message?.startsWith("Provider keys already exist")) {
          dispatch(
            showToaster({
              variant: "error",
              title: response?.data?.message,
              description: "",
            })
          );
        } else {
          setIsSaved(true);
          // onInputChange(true);
          dispatch(
            showToaster({
              variant: "success",
              title: `Your ${keyName} API key has been successfully saved.`,
              description: ``,
            })
          );
          dispatch(fetchUserApiKeys(currentUser?.uid));
        }
      }
    } catch (error) {
      dispatch(
        showToaster({
          variant: "error",
          title: `Failed to save ${keyName} API key. Please try again later.`,
          description: ``,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!VALID_PROVIDERS.includes(keyName)) {
      dispatch(
        showToaster({
          variant: "error",
          title: `You can only add or edit keys for the following providers: ${VALID_PROVIDERS.join(
            ", "
          )}. Please check the provider name and try again.`,
          description: ``,
        })
      );
      return;
    }
    setIsLoading(true);
    const encryptedKey = encryptApiKey(key);

    let formData = new FormData();

    formData.append("user_id", currentUser?.uid);
    formData.append("provider_name", keyName);
    formData.append("api_key", encryptedKey);
    formData.append("is_default", true);

    try {
      const response = await axios.patch(
        process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/user_key",
        formData
      );
      if (response.status === 200) {
        setIsSaved(true);
        // onInputChange(true);
        dispatch(
          showToaster({
            variant: "success",
            title: `Your ${keyName} API key has been successfully edited.`,
            description: ``,
          })
        );
        dispatch(fetchUserApiKeys(currentUser?.uid));
      }
    } catch (error) {
      if (error?.response?.data?.message?.startsWith("Provider ")) {
        dispatch(
          showToaster({
            variant: "error",
            title: error?.response?.data?.message,
            description: ``,
          })
        );
      } else {
        dispatch(
          showToaster({
            variant: "error",
            title: `Failed to edit ${keyName} API key. Please try again later.`,
            description: ``,
          })
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (provider_name) => {
    try {
      await onDelete(provider_name).unwrap();
      setIsSaved(false);
      setShowDeleteConfirm(false);
      setKey("");
      // setKeyName("");
      onToggle(false);
      // onInputChange(false);
    } catch (error) {}
  };

  const handleAddKey = () => {
    onToggle(true);
    if (isSaved) {
      setIsSaved(false);
    }
  };

  const handleCancel = () => {
    if (
      existingKeyData &&
      existingKeyData?.api_key &&
      existingKeyData?.provider_name
    ) {
      setIsSaved(true);
      setKey(
        decryptApiKey(existingKeyData.api_key)
          ? decryptApiKey(existingKeyData.api_key)
          : existingKeyData.api_key
      );
      // setKeyName(existingKeyData.provider_name);
    }
    onToggle(false);
  };

  const handleTestConnection = () => {
    setTestStatus("checking");
    setTimeout(() => {
      setTestStatus("success");
      setTimeout(() => setTestStatus(null), 5000);
    }, 2000);
  };

  const renderTestConnectionButton = () => {
    if (testStatus === "checking") {
      return (
        <span className="text-sm font-[Inter,sans-serif] font-normal dark:text-[#ffffff8a] text-primary">
          Checking ...
        </span>
      );
    }

    if (testStatus === "success") {
      return (
        <span
          className="text-sm font-[Inter,sans-serif] font-normal text-[#31a133] underline "
          style={{ textUnderlineOffset: "4px" }}
        >
          API is working
        </span>
      );
    }

    if (testStatus === "error") {
      return (
        <div className="flex items-center gap-1.5">
          <MdError size={17} className="text-[#9e1c1c]" />
          <span
            className="text-sm font-[Inter,sans-serif] font-normal text-[#9e1c1c] underline "
            style={{ textUnderlineOffset: "4px" }}
          >
            API key is not working
          </span>
        </div>
      );
    }

    return (
      <button
        className="text-sm font-[Inter,sans-serif] font-normal dark:text-white87 text-primary"
        onClick={handleTestConnection}
      >
        Test connection
      </button>
    );
  };

  return (
    <div
      className={`border rounded-lg p-4 ${
        isOpen
          ? "border-[#745ffb] dark:bg-[#2c2c3c] bg-[#F5F5FF]"
          : "dark:border-[#ffffff1e] dark:bg-white12  bg-primary border-lightBorder"
      } cursor-auto`}
    >
      <div className="flex gap-3">
        <div className="dark:bg-white12 min-w-10 h-10 p-2 rounded-lg bg-[#F4F2FF] flex justify-center items-center">
          <Icon
            type={imageUrl}
            width={24}
            height={24}
            fill={darkMode ? "white" : "black"}
            className=" w-6 h-6 flex items-center justify-center"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2 items-center">
            <h2 className="text-base font-[Inter,sans-serif] font-semibold dark:text-white text-primary">
              {title}
            </h2>
            {existingKeyData &&
              existingKeyData?.api_key &&
              existingKeyData.provider_name &&
              !isOpen && (
                <FaCheckCircle
                  size={20}
                  className="text-[#31a133]  border bg-white border-[#31a133] rounded-full  "
                />
              )}
          </div>
          <p className="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-primary">
            {description}
          </p>
        </div>
      </div>

      {!isOpen && (
        <div
          className="dark:bg-white12 bg-[#E2E2E2] rounded-lg py-2 px-3 mt-3 flex items-center justify-center gap-2 w-fit cursor-pointer"
          onClick={handleAddKey}
        >
          <FaPlus size={15} className="text-label dark:text-white" />
          <span className="text-sm font-[Inter,sans-serif] font-[300] dark:text-white">
            {isSaved || existingKeyData?.api_key
              ? "Edit API key"
              : "Add API key"}
          </span>
        </div>
      )}

      {isOpen && (
        <>
          <div className="h-[1px] w-full dark:bg-white12 mt-4"></div>
          <div className="pt-4">
            <div className="flex w-full gap-2">
              <div className="flex-1">
                <h3 className="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-primary mb-2">
                  Key
                </h3>
                <Input
                  type="text"
                  placeholder="Enter API Key"
                  inputStyle="placeholder:font-[500] placeholder:font-[Inter] dark:placeholder:text-[#ffffff8a]  outline-none !border dark:!border-[#ffffff23] text-[#1C274C] font-normal rounded-lg dark:bg-white12 text-primary dark:text-white !text-base"
                  onChange={handleKeyChange}
                  value={key}
                  disabled={isSaved}
                />
              </div>
              {/* <div className="flex-1">
                <h3 className="text-sm font-[Inter,sans-serif] font-normal dark:text-white text-primary mb-2">
                  Name (Optional)
                </h3>
                <Input
                  type="text"
                  placeholder="API key name"
                  inputStyle="placeholder:font-[500] placeholder:font-[Inter] dark:placeholder:text-[#ffffff8a]  outline-none !border dark:!border-[#ffffff23] text-[#1C274C] font-normal rounded-lg dark:bg-white12 dark:text-white !text-base"
                  onChange={handleKeyNameChange}
                  value={keyName}
                  disabled={isSaved}
                />
              </div> */}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                {!isSaved ? (
                  <>
                    <button
                      className={` ${
                        !key || !keyName
                          ? "dark:bg-white12 bg-[#E2E2E2]"
                          : "bg-[#745ffb]"
                      }  rounded-lg py-2 px-2.5 flex items-center justify-center gap-2`}
                      onClick={() => {
                        if (
                          existingKeyData &&
                          existingKeyData?.api_key &&
                          existingKeyData?.provider_name
                        ) {
                          handleEdit();
                        } else {
                          handleSave();
                        }
                      }}
                      disabled={!key || !keyName || isLoading}
                    >
                      <FaSave
                        size={15}
                        className={`text-primary   ${
                          !key || !keyName
                            ? "dark:text-[#ffffff8a]"
                            : "dark:text-white"
                        }`}
                      />

                      <span
                        className={`text-sm font-[Inter,sans-serif] font-normal   ${
                          !key || !keyName
                            ? "dark:text-[#ffffff8a] text-primary "
                            : "dark:text-white text-primary"
                        }`}
                      >
                        {existingKeyData &&
                        existingKeyData?.api_key &&
                        existingKeyData?.provider_name
                          ? isLoading
                            ? "Editing..."
                            : "Edit"
                          : isLoading
                          ? "Saving..."
                          : "Save"}
                      </span>
                    </button>
                    <button
                      className="text-sm font-[Inter,sans-serif] font-normal dark:text-[#ffffff8a] text-primary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="dark:bg-white12 bg-[#E2E2E2] rounded-lg py-2 px-2.5 flex items-center justify-center gap-2">
                      <FaSave
                        size={15}
                        className={`text-label dark:text-[#ffffff8a]  `}
                      />
                      <span className="text-sm font-[Inter,sans-serif] font-normal dark:text-[#ffffff8a] text-primary">
                        Saved
                      </span>
                    </div>
                    <button
                      className="text-sm font-[Inter,sans-serif] font-normal dark:text-white87 text-primary"
                      onClick={() => onToggle(false)}
                    >
                      Collapse
                    </button>
                  </>
                )}
              </div>
              {(isSaved ||
                (existingKeyData &&
                  decryptApiKey(existingKeyData.api_key) == key)) && (
                <div className="flex items-center gap-4">
                  {showDeleteConfirm ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm  font-medium dark:text-white text-primary">
                        Are you sure?
                      </span>
                      <div className="flex items-center gap-[5px]">
                        <button
                          onClick={() => {
                            handleDelete(keyName && keyName);
                          }}
                          className="text-sm  font-normal dark:text-white underline text-primary"
                          style={{ textUnderlineOffset: "3px" }}
                        >
                          Delete
                        </button>
                        <span className="text-sm  font-normal dark:text-white text-primary">
                          •
                        </span>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="text-sm  font-normal dark:text-white underline text-primary"
                          style={{ textUnderlineOffset: "3px" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* {renderTestConnectionButton()} */}
                      <button
                        className="bg-[#9e1c1c] rounded-lg py-2 px-2.5 flex items-center justify-center gap-2"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <MdDelete
                          size={17}
                          className=" dark:text-white text-white"
                        />
                        <span className="text-sm  font-normal text-white">
                          Delete
                        </span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddKeyForm;
