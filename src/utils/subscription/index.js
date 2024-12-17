import moment from "moment";

export const hasActivePremiumSubscription = (userSubscription) => {
  const isActivePremium =
    userSubscription?.user_info?.subscription_plan == "monthly" &&
    userSubscription?.user_info?.subscription_type == "Premium" &&
    moment(userSubscription?.user_info?.subscription_end_date).isAfter(
      moment()
    );

  const isActiveAnnualPremium =
    userSubscription?.user_info?.subscription_plan ==
      process.env.NEXT_PUBLIC_ANNUAL_PREMIUM_PLAN &&
    userSubscription?.user_info?.subscription_type == "Premium" &&
    userSubscription?.user_info?.remaining_days > 0;

  const isActiveAnnualScale =
    userSubscription?.user_info?.subscription_plan ==
      process.env.NEXT_PUBLIC_ANNUAL_SCALE_PLAN &&
    userSubscription?.user_info?.subscription_type == "Premium" &&
    userSubscription?.user_info?.remaining_days > 0;

  return isActivePremium || isActiveAnnualPremium || isActiveAnnualScale;
};

export const isCanceledPremium = (userSubscription) => {
  const isCanceledPremium =
    (userSubscription?.user_info?.subscription_plan == "monthly" &&
      userSubscription?.user_info?.subscription_type == "Premium" &&
      moment(userSubscription?.user_info?.subscription_end_date).isAfter(
        moment()
      )) ||
    (userSubscription?.user_info?.subscription_plan == "trial" &&
      moment(userSubscription?.user_info?.subscription_end_date).isAfter(
        moment()
      ) &&
      userSubscription?.user_info?.subscription_status == "active") ||
    (userSubscription?.user_info?.subscription_plan ==
      process.env.NEXT_PUBLIC_ANNUAL_PREMIUM_PLAN &&
      userSubscription?.user_info?.subscription_type == "Premium" &&
      userSubscription?.user_info?.remaining_days > 0) ||
    (userSubscription?.user_info?.subscription_plan ==
      process.env.NEXT_PUBLIC_ANNUAL_SCALE_PLAN &&
      userSubscription?.user_info?.subscription_type == "Premium" &&
      userSubscription?.user_info?.remaining_days > 0);

  return isCanceledPremium;
};

export const hasActiveTrialSubscription = (userSubscription) => {
  const isActiveTrial =
    userSubscription?.user_info?.subscription_plan == "trial" &&
    moment(userSubscription?.user_info?.subscription_end_date).isAfter(
      moment()
    ) &&
    userSubscription?.user_info?.subscription_status == "active";

  return isActiveTrial;
};

export const getUserSubscriptionState = (userSubscription) => {
  const subscriptionPlan = userSubscription?.user_info?.subscription_plan;
  const subscriptionType = userSubscription?.user_info?.subscription_type;
  const subscriptionStatus = userSubscription?.user_info?.subscription_status;
  const remaining_days = userSubscription?.user_info?.remaining_days;
  const subscriptionEndDate =
    userSubscription?.user_info?.subscription_end_date;
  const daysLeft = moment(subscriptionEndDate).diff(moment(), "days");

  if (userSubscription?.sumo_data && userSubscription.sumo_data?.tier) {
    return "premium";
  }

  if (subscriptionPlan == "" && subscriptionType == "Free") {
    if (subscriptionStatus == "canceled") {
      return "renew";
    } else {
      return "free";
    }
  }

  if (subscriptionPlan == "trial") {
    if (daysLeft > 0 && subscriptionStatus == "active") {
      return `trialActive`;
    } else {
      return "renew";
    }
    // return "trial";
  }

  if (
    (subscriptionPlan == "monthly" ||
      subscriptionPlan == process.env.NEXT_PUBLIC_ANNUAL_PREMIUM_PLAN ||
      subscriptionPlan == process.env.NEXT_PUBLIC_ANNUAL_SCALE_PLAN) &&
    subscriptionType == "Premium" &&
    remaining_days > 0
    //  && subscriptionStatus == "active"
  ) {
    return "premium";
  }

  if (
    (subscriptionPlan == "monthly" ||
      subscriptionPlan == process.env.NEXT_PUBLIC_ANNUAL_PREMIUM_PLAN ||
      subscriptionPlan == process.env.NEXT_PUBLIC_ANNUAL_SCALE_PLAN) &&
    subscriptionType == "Premium" &&
    daysLeft <= 0
  ) {
    return "renew";
  }

  return "free";
};
