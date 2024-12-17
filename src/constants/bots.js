import { useSelector } from "react-redux";

const BotsData = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const bots = useSelector((state) => state.bot.bots);
  const customUserBot = useSelector((state) => state.bot.customUserBot);

  const customBot = bots.find((bot) => bot.bname === "Custom Bot");
  // const otherBots = bots.filter((bot) => bot.bname !== "Custom Bot");

  const customBotData = customBot
    ? {
        id: 0,
        name: customBot.bname,
        icon: `bind-ai`,
        botId: customBot.id,
        route: "custom-bot",
        title: customBot.bname,
        metaDescription: "Custom bot",
      }
    : null;

  const otherBotsData = customUserBot
    ? {
        id: customUserBot.id,
        name: customUserBot.bname,
        icon: `bind-ai`,
        botId: customUserBot.id,
        route: customUserBot?.bname.toLowerCase().replace(/\s+/g, "-"),
        title: customUserBot.bname,
        metaDescription: customUserBot?.base,
      }
    : null;

  const DEFAULT_BOTS = defaultBots(darkMode, customBotData, otherBotsData);

  return DEFAULT_BOTS;
};

export function defaultBots(
  darkMode = false,
  customBot = null,
  otherBots = null
) {
  const DEFAULT_BOTS = [
    {
      id: 1,
      name: "Bind AI",
      icon: `bind-ai`,
      botId: "661cacc79657814effd8db6c",
      route: "bind-ai",
      title: "Bind AI",
      metaDescription:
        "Bind AI is an AI Assistant for code generation, searching the web, writing marketing articles and much more. It is an alternative to Perplexity AI and Microsoft Bing Copilot.",
    },
    {
      id: 2,
      name: "Web Search",
      icon: `web-search`,
      botId: "664aaf841bccad5bb77c96ab",
      route: "web-search",
      title: "Bind AI Web Search",
      metaDescription:
        "AI-powered Search Engine using advanced LLMs such as GPT-4o, Claude 3. Alternative to Perplexity AI. ",
    },
    // {
    //   id: 2,
    //   name: "Article Writer",
    //   icon: "article",
    //   botId: "661cd9999657814effd8db75",
    // },
    // {
    //   id: 3,
    //   name: "Bind Pro",
    //   icon: "bind",
    //   botId: "661d1be654fbf90df25b5d1f",
    // },
    {
      id: 3,
      name: "Code Generator",
      icon: `code-icon`,
      botId: "660f2def795718a92af22fc1",
      route: "code-generation",
      title: "Bind AI code generation",
      metaDescription:
        "AI powered code generation, code assistant, technical documentation writer. Generate, compile and execute your code. Alternative to GitHub copilot",
    },
    // {
    //   id: 5,
    //   name: "Data Analyst",
    //   icon: "article",
    //   botId: "661cdc44795718a92af23203",
    // },
  ];

  // const allBots = [...DEFAULT_BOTS, ...otherBots];

  // if (customBot) {
  //   return [customBot, ...DEFAULT_BOTS];
  // }

  // return DEFAULT_BOTS;

  let result = [...DEFAULT_BOTS];

  // Add customBot if it exists
  if (customBot) {
    result = [customBot, ...result];
  }

  // Add otherBots if they exist
  if (otherBots) {
    result = [otherBots, ...result];
  }

  return result;
}

export default BotsData;
