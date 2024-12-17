"use client";

import Threads from "@/components/common/thread/Threads";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { setBotMessage } from "@/redux/reducers/botReducer";
import { createNewSession } from "@/redux/reducers/sessionReducer";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactTextareaAutosize from "react-textarea-autosize";

const { default: Image } = require("next/image");
const { default: MessageContainer } = require("./MessageContainer");

const WebBotHome = ({ botId }) => {
  const inputRef = useRef();
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const threadBarOpen = useSelector((state) => state.common.threadBarOpen);
  const canvasOpen = useSelector((state) => state.code.canvasOpen);

  const handleSubmit = () => {
    if (botId && msg) {
      dispatch(createNewSession({ botId: "661cacc79657814effd8db6c" }));
      router.push(`/chat/${botId}`);
      dispatch(setBotMessage(msg));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && msg.trim() !== "") {
      if (!e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="flex">
      <div
        className={` dark:bg-darkProject bg-lightProject  ${
          threadBarOpen
            ? "min-w-[265px] max-w-[265px]"
            : "min-w-[55px] max-w-[55px]"
        } border-r dark:border-r-[#ffffff23] md:block hidden`}
      >
        <Threads botId={"661cacc79657814effd8db6c"} origin="home" />
      </div>
      <div className="relative h-[calc(100vh-70px)] w-full">
        <div
          className={`w-11/12 position ${
            canvasOpen ? "md:w-11/12" : "md:w-[75%]"
          }`}
        >
          <div className="flex items-center justify-center flex-col gap-8">
            <Logo
              width={100}
              height={100}
              className="hidden  sm:block"
              childClass={"w-44 h-11 block"}
            />
            <p className="text-[20px] md:text-[30px] w-[100%] text-center dark:text-white">
              Reimagine your work with Bind AI
            </p>
            <div
              className={`w-full ${canvasOpen ? "md:w-[80%]" : "md:w-full"}`}
            >
              <div className="home-webbot-textarea bg-[#fff] dark:bg-darkTextArea dark:border-darkPrimary">
                <ReactTextareaAutosize
                  autoFocus
                  ref={inputRef}
                  className="w-full p-3 pb-0 max-h-[248px] min-h-[74px] rounded-lg dark:bg-darkTextArea dark:text-white"
                  placeholder="Enter your message here"
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={handleKeyPress}
                  value={msg}
                />

                <div className="flex mb-2 mr-1.5">
                  <div className="flex-1"></div>
                  <Button
                    variant="link"
                    icon="/svgs/send-button.svg"
                    onlyIcon
                    onClick={handleSubmit}
                    width={21}
                    height={21}
                  />
                </div>
              </div>
              <div className="hidden text-sm md:flex md:w-[1000px] supported-models">
                <p className="text-sm font-normal text-[#3A4363] dark:text-white">
                  Supported models:
                </p>
                <Image
                  src="/images/gpt.png"
                  className="ml-1.5 mr-1 w-4 h-4 self-center"
                  alt="GPT-4"
                  width={17}
                  height={17}
                />
                <p className="text-sm font-normal text-[#3A4363] dark:text-white">
                  GPT-4o,
                </p>
                <Image
                  src="/images/llama2.png"
                  className="ml-1.5 mr-1 w-4 h-4 self-center"
                  alt="Llama2"
                  width={17}
                  height={17}
                />
                <p className="text-sm font-normal text-[#3A4363] dark:text-white">
                  {" "}
                  Llama 3,
                </p>
                <Image
                  src="/images/mistral-ai.png"
                  className="ml-1.5 mr-1 w-3.5 h-3.5 self-center"
                  alt="Mistral-AI"
                  width={17}
                  height={17}
                />
                <p className="text-sm font-normal text-[#3A4363] dark:text-white">
                  Mistral AI,
                </p>
                <Image
                  src="/images/claude.png"
                  className="ml-1.5 mr-1 w-4 h-4 self-center"
                  alt="claude"
                  width={17}
                  height={17}
                />
                <p className="text-sm font-normal text-[#3A4363] dark:text-white">
                  Claude 3.5 Sonnet
                </p>
              </div>
            </div>
          </div>
        </div>
        <style>
          {`
          .chat {
            border-radius: 16px 0px 0px 0px;
            background: rgb(255, 255, 255);
          }
          .position{
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%)
          }
          .supported-models{
            margin-top: 8px;
            color: var(--main-873-a-4363, #3A4363);
            font-family: Inter;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            text-align: left;
            justify-content: start;
        }

        .home-webbot-textarea{
          border-radius: 8px;
          border: 3px solid var(--yellow-ffe-0-b-3, #FFE0B3);
          // background: #FFF;
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
    </div>
  );
};

export default WebBotHome;
