import Button from "@/components/ui/Button";
import { hidePopup } from "@/redux/reducers/commonReducer";
import Image from "next/image";
import { useDispatch } from "react-redux";

const FreeTierPopup = ({
  heading,
  icon,
  icon2,
  desc,
  subDesc,
  buttonText,
  text,
  handleSubDescClick,
  handleClick,
  handleTextClick,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="px-6 py-6 ">
      <div className="">
        <Image
          src="/images/cross.png"
          alt="close"
          width={24}
          height={24}
          className="block cursor-pointer float-end"
          onClick={() => dispatch(hidePopup())}
        />
      </div>
      <div className="mt-8">
        <h1 className="text-center text-[24px] font-semibold font-[Inter] text-primary">
          {heading ? heading : "Introducing GPT-4o"}
        </h1>
        <div className="flex justify-center mt-5 gap-5">
          {icon2 && (
            <Image
              src={`/images/${icon2 ? icon2 : "bind1"}.png`}
              alt="bind logo"
              width={icon == "bind1" ? 80 : 260}
              height={icon == "bind1" ? 80 : 85}
              // className="block w-20 h-20"
            />
          )}
          <Image
            src={`/images/${icon ? icon : "bind1"}.png`}
            alt="bind logo"
            width={icon == "bind1" ? 80 : 260}
            height={icon == "bind1" ? 80 : 85}
            // className="block w-20 h-20"
          />
        </div>

        <p className="text-center text-sm font-normal font-[Inter] text-primary mt-5">
          {desc
            ? desc
            : "We're giving you limited access to Open AI's most advanced model. You can try Claude, Cohere, Mistral and other models."}{" "}
          {subDesc && (
            <span
              className="underline cursor-pointer"
              onClick={handleSubDescClick && handleSubDescClick}
            >
              {subDesc}
            </span>
          )}
        </p>

        <Button
          variant="primary"
          size="large"
          className={"w-full !rounded-lg mt-5"}
          onClick={handleClick}
        >
          <p className="font-medium text-[16px] text-[white]">
            {buttonText ? buttonText : "Chat with Bind AI"}
          </p>
        </Button>

        <p className="text-center font-normal text-sm text-[#848A9E] mt-4">
          <span
            className="underline"
            onClick={
              handleTextClick && handleTextClick
              //     () =>
              //   window.open(process.env.NEXT_PUBLIC_INTRODUCING_BIND, "_blank")
            }
          >
            {text && text}
          </span>
        </p>
      </div>
    </div>
  );
};

export default FreeTierPopup;
