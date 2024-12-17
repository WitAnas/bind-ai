import Button from "@/components/ui/Button";
import { showPopup } from "@/redux/reducers/commonReducer";
import moment from "moment";
import Image from "next/image";
import PremiumPopup from "./PremiumPopup";
import { useDispatch, useSelector } from "react-redux";
import ProfileContainer from "../profile/ProfileContainer";

function SubscriptionButton({ userSubscription }) {
  const subscriptionPlan = userSubscription?.user_info?.subscription_plan;
  const remaining_days = userSubscription?.user_info?.remaining_days;
  const subscriptionEndDate =
    userSubscription?.user_info?.subscription_end_date;
  const trialAvailable = userSubscription?.user_info?.trial_available;
  const subscriptionType = userSubscription?.user_info?.subscription_type;
  const subscriptionStatus = userSubscription?.user_info?.subscription_status;
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();

  if (userSubscription?.sumo_data) {
    const sumoTier = userSubscription.sumo_data?.tier;

    return (
      <Button variant="bg-[#e1ddfe]" className="!rounded-3xl">
        <span className="flex items-center gap-2 px-2">
          <Image
            src={`/images/premium1.png`}
            alt="premium"
            width={14}
            height={14}
          />
          <span className="font-semibold text-sm text-[#4529fa]">
            {sumoTier ? `Tier ${sumoTier}` : "AppSumo user"}
          </span>
        </span>
      </Button>
    );
  }

  const currentDate = moment();
  const daysLeft = moment(subscriptionEndDate).diff(currentDate, "days");

  let buttonContent;
  let buttonVariant;

  if (subscriptionPlan == "" && subscriptionType === "Free") {
    if (subscriptionStatus == "canceled") {
      buttonContent = (
        <div
          onClick={() => {
            dispatch(
              showPopup({
                title: "",
                description: (
                  <ProfileContainer userName={currentUser?.displayName} />
                ),
                btnArray: [],
                classAdditions: {
                  popupContainer: "md:w-1/3 w-12/12",
                },
              })
            );
          }}
          className="flex gap-2 items-center"
        >
          <Image
            src={`/images/premium2.png`}
            alt="premium"
            width={20}
            height={20}
            className="h-[18px] w-[18px]"
          />
          <span className="font-semibold text-sm text-[#9e1c1c]">
            Subscribe Now
          </span>
        </div>
      );
      buttonVariant = "bg-[#ecd2d2]";
    } else {
      return null;
    }
  } else if (subscriptionPlan === "trial") {
    if (daysLeft > 0 && subscriptionStatus == "active") {
      buttonContent = (
        <>
          <Image
            src={`/images/premium1.png`}
            alt="premium"
            width={14}
            height={14}
          />
          <span className="font-semibold text-sm text-[#4529fa]">
            {`${daysLeft} days left`}
          </span>
        </>
      );
      buttonVariant = "bg-[#e1ddfe]";
    } else {
      // buttonContent = (
      //   <div
      //     onClick={() => {
      //       dispatch(
      //         showPopup({
      //           title: "",
      //           description: <PremiumPopup />,
      //           btnArray: [],
      //           classAdditions: {
      //             popupContainer:
      //               "w-full md:w-[28%] h-[90%] md:h-auto rounded-t-2xl",
      //             popup:
      //               "h-screen !rounded-none w-full md:h-auto md:!rounded-lg",
      //             additional: "fixed md:relative bottom-0",
      //           },
      //         })
      //       );
      //     }}
      //     className="flex gap-2 items-center"
      //   >
      //     <Image
      //       src={`/images/premium2.png`}
      //       alt="premium"
      //       width={20}
      //       height={20}
      //       className="h-[18px] w-[18px]"
      //     />
      //     <span className="font-semibold text-sm text-[#9e1c1c]">
      //       Buy Premium
      //     </span>
      //   </div>
      // );
      // buttonVariant = "bg-[#ecd2d2]";
      buttonContent = (
        <div
          onClick={() => {
            dispatch(
              showPopup({
                title: "",
                description: (
                  <ProfileContainer userName={currentUser?.displayName} />
                ),
                btnArray: [],
                classAdditions: {
                  popupContainer: "md:w-1/3 w-12/12",
                },
              })
            );
          }}
          className="flex gap-2 items-center"
        >
          <Image
            src={`/images/premium2.png`}
            alt="premium"
            width={20}
            height={20}
            className="h-[18px] w-[18px]"
          />
          <span className="font-semibold text-sm text-[#9e1c1c]">
            Subscribe Now
          </span>
        </div>
      );
      buttonVariant = "bg-[#ecd2d2]";
    }
  } else if (
    subscriptionPlan === "monthly" ||
    subscriptionPlan === process.env.NEXT_PUBLIC_ANNUAL_PREMIUM_PLAN
  ) {
    // const isSubscriptionActive =
    //   moment(subscriptionEndDate).isAfter(currentDate);

    if (daysLeft > 0) {
      buttonContent = (
        <>
          <Image
            src={`/images/premium1.png`}
            alt="premium"
            width={14}
            height={14}
          />
          <span className="font-semibold text-sm text-[#4529fa]">Premium</span>
        </>
      );
      buttonVariant = "bg-[#e1ddfe]";
    } else {
      buttonContent = (
        <div
          onClick={() => {
            dispatch(
              showPopup({
                title: "",
                description: (
                  <ProfileContainer userName={currentUser?.displayName} />
                ),
                btnArray: [],
                classAdditions: {
                  popupContainer: "md:w-1/3 w-12/12",
                },
              })
            );
          }}
          className="flex gap-2 items-center"
        >
          <Image
            src={`/images/premium2.png`}
            alt="premium"
            width={20}
            height={20}
            className="h-[18px] w-[18px]"
          />
          <span className="font-semibold text-sm text-[#9e1c1c]">Renew</span>
        </div>
      );
      buttonVariant = "bg-[#ecd2d2]";
    }
  } else if (subscriptionPlan === process.env.NEXT_PUBLIC_ANNUAL_SCALE_PLAN) {
    if (remaining_days > 0) {
      buttonContent = (
        <>
          <Image
            src={`/images/premium1.png`}
            alt="premium"
            F
            width={14}
            height={14}
          />
          <span className="font-semibold text-sm text-[#4529fa]">Scale</span>
        </>
      );
      buttonVariant = "bg-[#e1ddfe]";
    } else {
      buttonContent = (
        <div
          onClick={() => {
            dispatch(
              showPopup({
                title: "",
                description: (
                  <ProfileContainer userName={currentUser?.displayName} />
                ),
                btnArray: [],
                classAdditions: {
                  popupContainer: "md:w-1/3 w-12/12",
                },
              })
            );
          }}
          className="flex gap-2 items-center"
        >
          <Image
            src={`/images/premium2.png`}
            alt="premium"
            width={20}
            height={20}
            className="h-[18px] w-[18px]"
          />
          <span className="font-semibold text-sm text-[#9e1c1c]">Renew</span>
        </div>
      );
      buttonVariant = "bg-[#ecd2d2]";
    }
  } else {
    return null;
  }

  return (
    <Button variant={buttonVariant} className="!rounded-3xl">
      <span className="flex items-center gap-2 px-2">{buttonContent}</span>
    </Button>
  );
}

export default SubscriptionButton;
