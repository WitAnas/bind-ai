import Image from "next/image";

const CodeGeneratorFeaturesList = () => {
  return (
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
        Advanced code generation with {" "}
          <span className="font-semibold">
            Claude 3.5 Sonnet, OpenAI GPT-4o, Mistral Codestral
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
        <span>Run and execute code for 20+ languages with built-in IDE</span>
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
        <span>Instantly Preview and Visualize web applications</span>
      </li>
    </ul>
  );
};

export default CodeGeneratorFeaturesList;
