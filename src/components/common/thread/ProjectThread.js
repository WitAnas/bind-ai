import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../Icon";
import { expandSidebar, toggleThreadBar } from "@/redux/reducers/commonReducer";

const ProjectThread = () => {
  const threadBarOpen = useSelector((state) => state.common.threadBarOpen);
  const sidebarOpen = useSelector((state) => state.common.sidebarCollapsed);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const dispatch = useDispatch();

  const threadData = [
    {
      title: "Create App.js",
      desc: "Short description. npx create-react-app my-app",
      icon: "",
    },
    {
      title: "Create a Design",
      desc: "Short description. npx create-react-app my-app",
      icon: "",
    },
    {
      title: "Front end code in NextJS and second row",
      desc: "Here Short description. npx create-react-app my-app",
      icon: "",
    },
    {
      title: "",
      desc: "No short description below Front end code in NextJS and second row",
      icon: "",
    },
  ];

  return (
    <div className="">
      <div className="pt-5 px-4 pb-2.5 border-b dark:border-[#ffffff14] border-lightBorder">
        {!threadBarOpen ? (
          <Icon
            type={"project-step"}
            width={25}
            height={25}
            fill={darkMode ? "#ffffffde" : "#3a4363"}
            className="mr-2 min-h-[22px] min-w-[17px]"
          />
        ) : (
          <>
            <p className="text-[12px] font-normal text-label dark:text-[#ffffffde]">
              Workflow
            </p>
            <h2 className="truncate text-sm font-medium dark:text-white text-primary">
              Web App for Real Estate
            </h2>
          </>
        )}
      </div>
      <div className="mt-1.5">
        {threadData.map((thread,index) => {
          return (
            <div className="" key={index}>
              <div className="px-4 flex flex-col gap-2 py-3 relative ">
                {threadBarOpen ? (
                  <div className="absolute w-1 h-[70%] bg-darkMutedPurple left-0 rounded-r-full"></div>
                ) : null}
                <div className="flex gap-1.5">
                  <FaCheckCircle
                    size={20}
                    className="min-w-5 min-h-5 text-[#31a133]"
                  />
                  {threadBarOpen ? (
                    <>
                      {thread.title ? (
                        <h2 className="text-sm font-medium dark:text-white text-primary">
                          {thread?.title}
                        </h2>
                      ) : (
                        <p className="dark:text-[#ffffff8a] text-sm font-medium text-label">
                          {thread.desc}
                        </p>
                      )}
                    </>
                  ) : null}
                </div>

                {threadBarOpen ? (
                  <>
                    {" "}
                    {thread.desc && thread.title && (
                      <p className="dark:text-[#ffffffde] text-[13px] font-normal text-label">
                        {thread.desc}
                      </p>
                    )}
                  </>
                ) : null}
              </div>
              {threadBarOpen ? (
                <div className="h-[1px] dark:bg-[#ffffff23] bg-[#e4e5ea] mx-4" />
              ) : null}
            </div>
          );
        })}
      </div>
      <div
        className={`${
          threadBarOpen && "border-b"
        } dark:border-[#ffffff14] border-[#ffffff14] flex justify-between items-center px-4 py-3`}
      >
        <div className="flex gap-1.5 items-center">
          <FaCheckCircle
            size={20}
            className="min-w-5 min-h-5 dark:text-[#ffffff0a] text-darkPrimary"
          />
          {threadBarOpen ? (
            <span className="dark:text-[#ffffff8a] text-sm font-medium text-label">
              Create a New Step
            </span>
          ) : null}
        </div>
        {threadBarOpen ? (
          <FaAngleRight
            size={12}
            className="min-w-1.5 min-h-2 dark:text-[#ffffff61] text-darkPrimary  mr-1"
          />
        ) : null}
      </div>

      <div
        className="absolute bottom-[10%] hidden md:flex items-center justify-center"
        onClick={() => {
          dispatch(toggleThreadBar());
          if (!threadBarOpen) {
            if (sidebarOpen) dispatch(expandSidebar());
          }
        }}
      >
        {threadBarOpen ? (
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
    </div>
  );
};

export default ProjectThread;
