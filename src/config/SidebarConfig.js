import ROUTES from "@/constants/routes";
import { useSelector } from "react-redux";

function SidebarConfig() {
  const darkMode = useSelector((state) => state.theme.darkMode);

  const sidebarRoutes = [
    {
      id: 1,
      link: ROUTES.CHAT.path,
      label: "Chat with Bind AI",
      icon: `${darkMode ? "darkChat" : "chat"}`,
      activeIcon: "darkChat",
      tooltipText: "Chat with Bind AI",
    },
    {
      id: 7,
      // link: ROUTES.AI_STUDIO.path,
      label: "AI Studio",
      icon: `${darkMode ? "darkAi-studio" : "ai-studio"}`,
      activeIcon: "darkAi-studio",
      tooltipText: "Create AI apps with Bind",
      target: "_blank",
    },
    {
      id: 2,
      // link: ROUTES.AI_STUDIO.path,
      label: "My threads",
      icon: `${darkMode ? "darkChat" : "chat"}`,
      activeIcon: "darkChat",
      tooltipText: "Threads",
      mobile: true,
    },
    {
      id: 3,
      // link: ROUTES.CONNECT_DATA.path,
      label: "Integrations",
      // icon: `${darkMode ? "darkConnect-data" : "connect-data"}`,
      icon: `${darkMode ? "darkPlugins" : "plugins"}`,
      activeIcon: "darkPlugins",
      target: "_blank",
    },
    // {
    //   id: 4,
    //   link: ROUTES.PLUGINS.path,
    //   label: "Plugins",
    //   icon: `${darkMode ? "darkPlugins" : "plugins"}`,
    //   activeIcon: "darkPlugins",
    //   target: "_blank",
    // },
    {
      id: 5,
      // link: ROUTES.TRY_PREMIUM.path,
      label: "Try Premium",
      icon: "premium",
      activeIcon: "premium",
      className: "text-[#0053C9] dark:!text-darkMutedPurple",
      target: "_blank",
    },
    // {
    //   id: 6,
    //   label: "Add Team Members",
    //   icon: `${darkMode ? "darkConnect-data" : "connect-data"}`,
    //   activeIcon: "darkConnect-data",
    //   // className: "text-[#0053C9] dark:!text-darkMutedPurple",
    //   target: "_blank",
    // },
  ];

  return sidebarRoutes;
}

export default SidebarConfig;
