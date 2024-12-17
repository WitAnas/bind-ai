import { defaultBots } from "@/constants/bots";
import Chat from "@/features/chat/components/chat";
import axios from "axios";
import React from "react";
export async function generateMetadata({ params }) {
  const botId = params?.botId;
  const bots = defaultBots();
  const defaultBot = bots.find((b) => b.botId === botId || b.route === botId);

  if (defaultBot) {
    return {
      title: defaultBot.title,
      description: defaultBot.metaDescription,
    };
  }

  try {
    let formData = new FormData();
    formData.append("botId", botId);
    const response = await axios.post(
      process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/bot/get",
      formData
    );

    const customBot = response?.data?.bot;
    return {
      title: customBot?.name || "Custom Bot",
      description:
        customBot?.desc ||
        `Chat with ${customBot?.name} - A custom AI assistant on Bind AI Copilot`,
    };
  } catch (error) {
    // console.log("Error fetching users bot:", error);
    return {
      title: "Custom Bot - Bind AI Copilot",
      description:
        "The bot you are looking for does not exist. Please check the URL or explore other bots available on our platform.",
    };
  }
}
const page = ({ params }) => {
  return (
    <>
      <Chat botId={params?.botId} />
    </>
  );
};

export default page;
