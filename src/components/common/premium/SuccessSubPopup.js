import Button from "@/components/ui/Button";
import { hidePopup } from "@/redux/reducers/commonReducer";
import { handleLogout } from "@/utils";
import Image from "next/image";
import { useDispatch } from "react-redux";
import BindFeaturesList from "../BindFeaturesList";

const SuccessSubPopup = () => {
  const dispatch = useDispatch();

  return (
    <div className="px-6 py-6 ">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[550] text-black">Success!</h3>
        <Image
          src="/images/cross.png"
          alt="close"
          width={24}
          height={24}
          className="block cursor-pointer"
          onClick={() => dispatch(hidePopup())}
        />
      </div>
      <div className="mt-6">
        <p className="font-normal text-[16px] text-primary ">
          Now you have access to premium features!
        </p>
        <p className="font-[550] text-[16px] mt-4 text-primary">
          Here is a list of features that are now available to you:
        </p>
      </div>

      <div className="mt-4 md:w-[85%]">
        <BindFeaturesList />
      </div>
      <Button
        variant="primary"
        size="large"
        className={"w-full !rounded-lg mt-6"}
        onClick={() => dispatch(hidePopup())}
      >
        <p className="font-medium text-[16px] text-[white]">
          {" "}
          Chat with Bind AI
        </p>
      </Button>

      <p className="text-center font-normal text-sm text-[#848A9E] mt-4">
        <span
          className="underline"
          onClick={() =>
            window.open(
              process.env.NEXT_PUBLIC_INTRODUCING_BIND,
              "_blank"
            )
          }
        >
          Learn more
        </span>{" "}
        about Premium and{" "}
        <span
          className="underline"
          onClick={() =>
            window.open(
              process.env.NEXT_PUBLIC_INTRODUCING_BIND,
              "_blank"
            )
          }
        >
          see usage limits.
        </span>
      </p>
    </div>
  );
};

export default SuccessSubPopup;
