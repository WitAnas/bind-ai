import { useState } from "react";
import GptAgent from "./GptAgent";

import { FaCirclePlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import Icon from "../Icon";
import { AgentSkeleton } from "@/components/ui/LoadingSkeleton";

const EmptyState = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-220px)]">
      <div className="w-full text-center space-y-4">
        <div className="flex justify-center">
          <Icon
            type={"gpt-agent"}
            width={40}
            height={40}
            fill={darkMode ? "white" : "black"}
            className=" w-10 h-10"
          />
        </div>
        <h3 className="text-lg font-semibold dark:text-white">
          No Agents Created Yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Create your first agent to streamline your chat with agents for code
          generation, website creation, HTML emails, and many more.
        </p>
      </div>
    </div>
  );
};

const GptAgentsDashboard = ({ onCreateAgent, onEditAgent }) => {
  const [activeTab, setActiveTab] = useState("myAgents");
  const { bots, loading } = useSelector((state) => state.bot);

  const agents = bots || [];

  const tabs = [
    { id: "myAgents", label: "My agents" },
    // { id: "saved", label: "Saved" },
    // { id: "recommended", label: "Recommended" },
  ];

  //   const filteredAgents = agents.filter((agent) => {
  //     switch (activeTab) {
  //       case "myAgents":
  //         return !agent.source;
  //       case "saved":
  //         return agent.saved;
  //       case "recommended":
  //         return agent.source === "BIND AI";
  //       default:
  //         return true;
  //     }
  //   });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <AgentSkeleton />
          <AgentSkeleton />
          <AgentSkeleton />
        </div>
      );
    }

    if (agents.length === 0) {
      return <EmptyState />;
    }

    return agents.map((agent) => (
      <GptAgent key={agent.id} agent={agent} onEdit={onEditAgent} />
    ));
  };

  return (
    <div className="w-full pt-5 cursor-default dark:bg-[#171719] h-full">
      <div className="flex justify-between items-center border-b border-lightBorder dark:!border-[#ffffff23] px-4">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-base font-medium ${
                activeTab === tab.id
                  ? " border-b-2 border-[#131314] dark:!border-[#ffffff] text-[#131314] dark:text-white"
                  : "  text-[#757575] "
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          onClick={onCreateAgent}
          className="flex items-center gap-2 pb-3 cursor-pointer"
        >
          <FaCirclePlus
            width={16}
            height={16}
            className="w-4 h-4 text-[#745ffb]"
          />
          <p className="text-[#745ffb] font-medium text-base">Create Agent</p>
        </div>
      </div>

      <div className=" pl-4 pr-2 mt-4 max-h-[calc(100vh-180px)] overflow-y-scroll agents">
        {renderContent()}
      </div>
      <style>
        {`
          .agents::-webkit-scrollbar {
            width: 8px;
          }

          .agents::-webkit-scrollbar-track {
            background: transparent;
          }

          .agents::-webkit-scrollbar-thumb {
            background: #e4e5ea;
            border-radius: 4px;
          }

          .agents::-webkit-scrollbar-thumb:hover {
            background: #e4e5ea;
          }
        `}
      </style>
    </div>
  );
};

export default GptAgentsDashboard;
