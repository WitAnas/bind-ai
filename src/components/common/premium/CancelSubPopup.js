import Button from "@/components/ui/Button";
import axios from "axios";
import moment from "moment";
import {
  hidePopup,
  showPopup,
  showToaster,
} from "@/redux/reducers/commonReducer";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserSubscription } from "@/redux/reducers/userSubscriptionReducer";

const CancelSubPopup = ({ cancel, cancelSubsState }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userSubscription = useSelector((state) => state.userSubscription);

  const cancelSubscription = async () => {
    const apiEndpoint = process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/cancel";
    const formData = new FormData();
    currentUser?.uid && formData.append("user_id", currentUser.uid);
    try {
      const response = await axios.post(apiEndpoint, formData);
      setTimeout(() => {
        dispatch(fetchUserSubscription(currentUser.uid));
      }, 1000);
      return response?.data;
    } catch (error) {
      console.log("error in cancel api", error);
    }
  };

  return (
    <div className="px-6 pb-6 pt-5">
      <div className="flex justify-between">
        <h3
          className={`text-[16px] font-[550] text-black ${
            cancel ? "invisible" : ""
          }`}
        >
          Cancel {cancelSubsState === "trial" ? "Trial" : "Subscription"}
        </h3>
        <Image
          src="/images/cross.png"
          alt="close"
          width={24}
          height={24}
          className="block cursor-pointer"
          onClick={() => dispatch(hidePopup())}
        />
      </div>
      {cancel ? (
        <>
          {cancelSubsState === "trial" ? (
            <>
              <p className="font-normal text-[16px] text-[#1C274C] mt-8">
                Your trial has been canceled. You no longer have access to Bind
                Premium.{" "}
              </p>
            </>
          ) : (
            <p className="font-normal text-[16px] text-[#1C274C] mt-8">
              Your subscription renewal has been canceled. You will still have
              access to Bind Premium until{" "}
              <span>
                {moment(
                  userSubscription?.user_info?.subscription_end_date
                ).format("MMMM DD, YYYY")}
              </span>
            </p>
          )}
        </>
      ) : (
        <>
          <div className="mt-6">
            <p className="font-normal text-[16px] text-primary ">
              Are you sure you want to cancel your{" "}
              {cancelSubsState === "trial" ? "Trial?" : "Subscription?"}
            </p>
            <p className="font-[550] text-[16px] mt-4 text-primary">
              After canceling, you will lose access to:
            </p>
          </div>

          <div className="mt-4 md:w-[85%]">
            <ul className="text-[14px] font-normal text-primary flex flex-col gap-1">
              <li className="flex ">
                {" "}
                <Image
                  src="/images/cancel.png"
                  alt="checklist"
                  width={20}
                  height={20}
                  className="mr-3 h-full"
                />
                <span>Premium models Claude Opus, GPT-4 .</span>
              </li>
              <li className="flex mt-2">
                {" "}
                <Image
                  src="/images/cancel.png"
                  alt="checklist"
                  width={20}
                  height={20}
                  className="mr-3 h-full"
                />
                <span>AI Studio: Create your own bots</span>
              </li>
              <li className="flex mt-2">
                {" "}
                <Image
                  src="/images/cancel.png"
                  alt="checklist"
                  width={20}
                  height={20}
                  className="mr-3 h-full"
                />
                <span>Custom LLM APIs</span>
              </li>
              <li className="flex mt-2">
                {" "}
                <Image
                  src="/images/cancel.png"
                  alt="checklist"
                  width={20}
                  height={20}
                  className="mr-3 h-full"
                />
                <span>Vector Index to store your data</span>
              </li>
            </ul>
          </div>
        </>
      )}
      <Button
        variant="bg-red-500 bg-opacity-15"
        size="large"
        className={"w-full !rounded-lg mt-6 py-8 md:p-0"}
        onClick={async () => {
          if (cancel) {
            dispatch(hidePopup());
          } else {
            const res = await cancelSubscription();
            if (res?.status !== "error") {
              dispatch(
                showPopup({
                  title: "",
                  description: (
                    <CancelSubPopup
                      cancel={true}
                      cancelSubsState={cancelSubsState}
                    />
                  ),
                  btnArray: [],
                  classAdditions: {
                    popupContainer: "md:w-[30%] w-11/12",
                  },
                })
              );
              dispatch(
                showToaster({
                  variant: "success",
                  title: `Your ${
                    cancelSubsState === "trial" ? "Trial" : "Subscription"
                  } has been canceled successfully.`,
                  description: "",
                })
              );
            } else {
              dispatch(
                showToaster({
                  variant: "error",
                  title: res?.msg,
                  description: "",
                })
              );
            }
          }
        }}
      >
        <p className="font-medium text-[16px] text-[#9e1c1c]">
          {cancel
            ? "Go back to Bind AI"
            : `Yes, I want to cancel my ${
                cancelSubsState === "trial" ? "Trial" : "Subscription"
              }`}
        </p>
      </Button>

      <p className="text-center flex justify-center items-center flex-col font-normal text-sm text-[#848A9E] mt-4 gap-1">
        Do you have any questions or need assistance?
        <span
          className="underline"
          onClick={() =>
            window.open(
              `${process.env.NEXT_PUBLIC_BIND_BASE_LINK}/support`,
              "_blank"
            )
          }
        >
          We&apos;re here to help!
        </span>
      </p>
    </div>
  );
};

export default CancelSubPopup;
