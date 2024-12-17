"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Icon from "./Icon";
import {
  setCanvasOpen,
  setCodeEditor,
  setDocumentEditor,
  setGptAgent,
} from "@/redux/reducers/codeEditorReducer";
import ToolTip from "../ui/Tooltip";

const RightSideBar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const [active, setActive] = useState(null);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const router = useRouter();
  const dispatch = useDispatch();
  const { codeEditor, documentEditor, gptAgent, canvasOpen } = useSelector(
    (state) => state.code
  );

  const rightSidebarConfig = [
    {
      id: 1,
      name: "resize",
      icon: canvasOpen ? "right-arrow" : "left-arrow",
      function: () => {
        dispatch(setCanvasOpen(!canvasOpen));
      },
      hover: "Open/Close Canvas",
    },
    {
      id: 2,
      name: "code",
      icon: "code-icon",
      botId: "660f2def795718a92af22fc1",
      route: "code-generation",
      function: () => {
        dispatch(setCodeEditor(!codeEditor));
      },
      hover: "Code Editor",
    },
    // { id: 3, name: "design", icon: "designToolIcon" },
    // { id: 4, name: "analytics", icon: "analyticsIcon" },
    {
      id: 5,
      name: "document",
      icon: "document-icon",
      botId: "661cacc79657814effd8db6c",
      route: "bind-ai",
      function: () => {
        dispatch(setDocumentEditor(!documentEditor));
      },
      hover: "Document Editor",
    },
    {
      id: 6,
      name: "gptAgent",
      icon: "gpt-agent",
      // botId: "661cacc79657814effd8db6c",
      // route: "bind-ai",
      function: () => {
        dispatch(setGptAgent(!gptAgent));
      },

      hover: "Gpt agent",
    },
  ];

  return (
    <>
      {rightSidebarOpen ? (
        <div className="w-[3%] flex flex-col justify-between mx-2 mt-4 cursor-pointer ">
          <div className="flex flex-col">
            {rightSidebarConfig.map((item) => {
              return (
                <div
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className="mb-2 relative"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div
                    key={item.id}
                    className={`rounded-md hover:dark:bg-[#333435] hover:bg-[#E4E5EA] ${
                      item.id === active
                        ? "dark:bg-[#333435] "
                        : "dark:bg-transparent"
                    }  `}
                    onClick={() => setActive(item.id)}
                  >
                    <div
                      className={`flex items-center justify-center py-2 ${
                        item.id === active &&
                        "bg-[#E4E5EA] rounded-lg dark:bg-[#333435]"
                      }`}
                      onClick={() =>
                        item?.function
                          ? item.function()
                          : item?.botId &&
                            item?.route &&
                            router.push(`/chat/${item?.route}`)
                      }
                    >
                      <Icon
                        type={item?.icon}
                        width={18}
                        height={18}
                        fill={darkMode ? "#F2F3F4" : "#1C274C"}
                        className=""
                      />
                    </div>
                  </div>
                  {hoveredItem === item.id && (
                    <div className="absolute right-[100%] top-1/2 transform -translate-y-1/2 mr-2 p-1.5 bg-[#333435] text-white text-xs rounded shadow-lg whitespace-nowrap tooltip">
                      {item.hover}
                      <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-[6px] border-l-[#333435]"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div
            className="mb-6 justify-center flex"
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          >
            {/* <Image
              src={`${
                darkMode
                  ? "/images/chevron-right.png"
                  : "/images/chevron-right_black.png"
              }`}
              alt={"collapse"}
              width={24}
              height={24}
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            /> */}
            <Icon
              type={"right-chevron"}
              width={12}
              height={12}
              fill={darkMode ? "#F2F3F4" : "#1C274C"}
              className=""
            />
          </div>
        </div>
      ) : (
        <div
          className="absolute right-0 bottom-10 py-5 pl-2 dark:bg-gray-700 bg-primary collapse-style cursor-pointer"
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
        >
          {/* <Image
            src={`/images/chevron-left.png`}
            alt={"collapse"}
            width={24}
            height={24}
          /> */}
          <Icon
            type={"left-chevron"}
            width={12}
            height={12}
            fill={darkMode ? "#F2F3F4" : "#1C274C"}
            className="mr-1.5"
          />
        </div>
      )}
      <style jsx>{`
        .collapse-style {
          border-radius: 16px 0px 0px 16px;
        }
      `}</style>
    </>
  );
};

export default RightSideBar;
