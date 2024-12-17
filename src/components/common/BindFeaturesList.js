import Image from "next/image";

const BindFeaturesList = ({ content, isConnectCarbon = false }) => {
  return (
    <>
      {content == "basic" ? (
        <ul className="text-[14px] font-normal text-primary flex flex-col gap-2">
          <li className="flex">
            {" "}
            <Image
              src="/images/checklist.png"
              alt="checklist"
              width={20}
              height={20}
              className="mr-3 h-full"
            />
            <p>Basic AI Models such as GPT-3.5</p>
          </li>
          <li className="flex mt-2">
            {" "}
            <Image
              src="/images/checklist.png"
              alt="checklist"
              width={20}
              height={20}
              className="mr-3 h-full"
            />
            <span>Limited queries with 16K context length</span>
          </li>
          <li className="flex mt-2">
            {" "}
            <Image
              src="/images/checklist.png"
              alt="checklist"
              width={20}
              height={20}
              className="mr-3 h-full"
            />
            <span>Best for general everyday use</span>
          </li>
        </ul>
      ) : content == "premium" ? (
        <ul className="text-[14px] font-normal text-primary flex flex-col gap-2">
          <li className="flex">
            {" "}
            <Image
              src="/images/checklist.png"
              alt="checklist"
              width={20}
              height={20}
              className="mr-3 h-full"
            />
            <p>
              Advanced AI Models such as{" "}
              <span className="font-semibold">
                Claude 3.5 Sonnet, GPT-4o, Codestral
              </span>
            </p>
          </li>
          <li className="flex mt-2">
            {" "}
            <Image
              src="/images/checklist.png"
              alt="checklist"
              width={20}
              height={20}
              className="mr-3 h-full"
            />
            <p>
              <span className="font-semibold">AI Code Generation </span>
              with Online Code Editor
            </p>
          </li>
          <li className="flex mt-2">
            {" "}
            <Image
              src="/images/checklist.png"
              alt="checklist"
              width={20}
              height={20}
              className="mr-3 h-full"
            />
            <p>
              <span className="font-semibold">
                Compile Code and Preview Web Pages{" "}
              </span>
              generated with AI
            </p>
          </li>
          <li className="flex mt-2">
            {" "}
            <Image
              src="/images/checklist.png"
              alt="checklist"
              width={20}
              height={20}
              className="mr-3 h-full"
            />
            <p>
              <span className="font-semibold">AI Writer </span>for blog posts,
              sales emails, technical documentation
            </p>
          </li>
        </ul>
      ) : content == "apikey" ? (
        <ul className=" font-normal text-primary flex flex-col gap-3 text-base font-[Inter,sans-serif]  dark:text-white">
          <li className="flex">
            {" "}
            <Image
              src="/images/checklist.png"
              alt="checklist"
              width={20}
              height={20}
              className="mr-3 h-full"
            />
            <p>
              Get unlimited queries with your API keys for Claude and GPT models
            </p>
          </li>
          <li className="flex ">
            {" "}
            <Image
              src="/images/checklist.png"
              alt="checklist"
              width={20}
              height={20}
              className="mr-3 h-full"
            />
            <span>
              Leverage Prompt caching with Claude for faster and cost-efficient
              responses
            </span>
          </li>
          <li className="flex ">
            {" "}
            <Image
              src="/images/checklist.png"
              alt="checklist"
              width={20}
              height={20}
              className="mr-3 h-full"
            />
            <span>
              Integrate your codebase and ask questions with your API keys
            </span>
          </li>
          <li className="flex">
            {" "}
            <Image
              src="/images/checklist.png"
              alt="checklist"
              width={20}
              height={20}
              className="mr-3 h-full"
            />
            <span>
              {" "}
              Access OpenAI o1 models if your API key is Tier 5 (feature coming
              soon)
            </span>
          </li>
        </ul>
      ) : (
        <ul className="text-[14px] font-normal text-primary flex flex-col gap-2">
          <li className="flex">
            {" "}
            <Image
              src="/images/checklist.png"
              alt="checklist"
              width={20}
              height={20}
              className="mr-3 h-full"
            />
            {isConnectCarbon ? (
              <p>
                Upload images, files, pdfs to get answers based on your data.
              </p>
            ) : (
              <p>
                Access Advanced Models such as
                {"  "}
                <span className="font-semibold">
                  Claude Opus, GPT-4, Mistral, Command R+
                </span>
              </p>
            )}
          </li>
          <li className="flex mt-2">
            {" "}
            <Image
              src="/images/checklist.png"
              alt="checklist"
              width={20}
              height={20}
              className="mr-3 h-full"
            />
            <span>
              {isConnectCarbon
                ? "Integrations to automatically connect your data from Github and Google Drive"
                : "Access to Web Search, Code Generator, Article Writer"}
            </span>
          </li>
          <li className="flex mt-2">
            {" "}
            <Image
              src="/images/checklist.png"
              alt="checklist"
              width={20}
              height={20}
              className="mr-3 h-full"
            />
            <span>
              {isConnectCarbon
                ? "Custom GPT which answers questions and generates code based on your data."
                : "Create custom LLM apps & APIs"}
            </span>
          </li>
        </ul>
      )}
    </>
  );
};

export default BindFeaturesList;
