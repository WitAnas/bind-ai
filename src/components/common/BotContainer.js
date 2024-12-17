"use client";

import { setDynamicText } from "@/redux/reducers/codeEditorReducer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Icon from "./Icon";

const BotContainer = ({ bots, botId }) => {
  const isOpen = useSelector((state) => state.common.sidebarCollapsed);
  const canvasOpen = useSelector((state) => state.code.canvasOpen);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div
      className={`flex items-center ${
        !isOpen
          ? canvasOpen
            ? "w-[93%]"
            : "w-[48%]"
          : canvasOpen
          ? "w-[630px]"
          : "w-[56%]"
      }  cursor-pointer gap-1.5`}
    >
      {bots.map((bot) => {
        return (
          <div
            className={`rounded-lg bot bg-white flex items-center justify-center py-2 px-4 dark:bg-darkBotPrimary ${
              bot?.botId && bot?.botId == botId
                ? "text-secondary dark:text-[#F2F3F4]  dark:border dark:border-[#745ffb] dark:!bg-[#3d406d]"
                : "text-label dark:text-white"
            }`}
            key={bot.id}
            onClick={() => {
              if (bot?.botId && bot?.route) {
                if (bot.botId == "660f2def795718a92af22fc1") {
                  dispatch(setDynamicText(""));
                }
                router.push(`/chat/${bot?.route}`);
              }
            }}
          >
            {/* <Image
              src={`/images/${bot.icon}.png`}
              alt={`${bot.icon}`}
              width={18}
              height={18}
              className={`block mr-3`}
            /> */}
            <Icon
              type={`${bot.icon}`}
              width={21}
              height={21}
              fill={darkMode ? "#F2F3F4" : "#1C274C"}
              className={`block  ${
                bot.icon == "bind-ai" ? "mt-1 mr-2" : "mr-3"
              }`}
            />
            <p className="font-medium" style={{ whiteSpace: "nowrap" }}>
              {bot.name}
            </p>
          </div>
        );
      })}
      <style jsx>
        {`
          .bot {
            box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.06);
          }
        `}
      </style>
    </div>
  );
};

export default BotContainer;
