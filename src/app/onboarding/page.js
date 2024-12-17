"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import OnboardingLayout from "@/features/onboarding/components/OnboardingLayout";

const OnboardingPage = () => {
  const searchParams = useSearchParams();
  const step = searchParams.get("step");
  const currentUser = useSelector((state) => state.auth.currentUser);
  const router = useRouter();
  const userSubscription = useSelector((state) => state.userSubscription);
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    if (!loading && !userSubscription.loading) {
      if (!currentUser?.uid) {
        router.back();
      }
    }
  }, [currentUser, router, loading, userSubscription.loading]);

  return <>{currentUser?.uid && <OnboardingLayout step={step} />}</>;
};

export default OnboardingPage;
