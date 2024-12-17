import { useState } from "react";
import Onboarding from "./Onboarding";
import SubscriptionStep from "./SubscriptionStep";
import Toaster from "@/components/ui/Toaster";
import { useDispatch, useSelector } from "react-redux";
import { showToaster } from "@/redux/reducers/commonReducer";
import axios from "axios";
import { updateUserPreferenceTheme } from "@/redux/reducers/userSubscriptionReducer";
import { useRouter } from "next/navigation";

const steps = [
  {
    type: "onboarding",
    question: "Select your Job Role",
    desc: "With this, we will be able to more accurately recommend actions for you",
    options: [
      "Founder or leadership team",
      "Engineering manager ",
      "Product manager ",
      "Designer",
      "Software developer ",
      "Content Writer",
      "I run an agency",
      "Freelancer",
      "Other",
      "Prefer not to share",
    ],
  },
  {
    type: "onboarding",
    question: "What do you want to use Bind AI for",
    desc: "Specify your tasks, and we will select a more suitable technology for you",
    options: [
      "Generating Code",
      "Writing Marketing Content",
      "Web Search",
      "Q&A on my own data",
      "Other",
    ],
  },
  {
    type: "onboarding",
    question: "What is your familiarity",
    desc: "Specify your tasks, and we will select a more suitable technology for you",
    options: [
      "I have an existing code to iterate on",
      "I am writing brand new code",
      "I am not a developer, I want AI to generate code for me",
    ],
  },
  {
    type: "onboarding",
    subType: "theme",
    question: "Choose your color scheme",
    desc: "Which workspace color is more comfortable for your eyes?",
    options: ["Dark", "Light"],
  },
  {
    type: "subscription",
    question: "$0 for 7 days. Try Premium Features",
    desc: "Maximize your productivity with the most advanced AI",
    content: "premium",
  },
  {
    type: "subscription",
    question: "Take another look: Basic vs Premium plan",
    desc: "Premium is ideal if you have code generation or content writing use cases, else we recommend the Basic Tier",
    content: "basic",
  },
];

const OnboardingLayout = ({ step }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const common = useSelector((state) => state.common);
  const [answers, setAnswers] = useState(
    Array(steps.filter((step) => step.type == "onboarding")?.length).fill(null)
  );
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userSubscription = useSelector((state) => state.userSubscription);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleOptionClick = (option) => {
    const newAnswers = [...answers];
    if (newAnswers[currentStep] === option) {
      newAnswers[currentStep] = null;
    } else {
      newAnswers[currentStep] = option;
    }
    setAnswers(newAnswers);
  };

  const handleContinue = async () => {
    if (currentStep < steps.length - 1) {
      if (
        steps[currentStep].type === "onboarding" &&
        steps[currentStep + 1].type === "subscription"
      ) {
        await submitAnswers();

        if (userSubscription?.sumo_data) {
          router.push("/");
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else if (
        currentStep === 1 &&
        answers[currentStep] !== "Generating Code"
      ) {
        setCurrentStep(currentStep + 2);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      router.push("/");
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      if (
        steps[currentStep].type === "onboarding" &&
        steps[currentStep + 1].type === "subscription"
      ) {
        if (userSubscription?.sumo_data) {
          router.push("/");
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else if (
        currentStep === 1 &&
        answers[currentStep] !== "Generating Code"
      ) {
        setCurrentStep(currentStep + 2);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      if (userSubscription?.sumo_data) {
        router.push("/");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      if (currentStep === 3 && answers[1] !== "Generating Code") {
        setCurrentStep(currentStep - 2);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const submitAnswers = async () => {
    try {
      let formData = new FormData();
      formData.append("user_id", currentUser?.uid);
      answers[0] && formData.append("role", answers[0]);
      answers[1] && formData.append("bot_info", answers[1]);
      answers[1] && formData.append("tech_stack", answers[2] || "");
      answers[3] && formData.append("theme", answers[3]);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/preferences",
        formData
      );

      answers[3] && dispatch(updateUserPreferenceTheme(answers[3]));

      return response.data;
    } catch (error) {
      console.log("Error:", error);
      // dispatch(
      //   showToaster({
      //     variant: "error",
      //     title: "Something went wrong. Please try again after some time.",
      //     description: "",
      //   })
      // );
    }
  };

  const isSubscriptionStep = steps[currentStep].type === "subscription";

  return (
    <div className="min-h-screen bg-onboarding p-4">
      <div className="flex justify-between md:p-4 mb-6">
        {currentStep > 0 ? (
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-label text-sm font-normal"
          >
            Back to previous step
          </button>
        ) : (
          <div></div>
        )}
        {!isSubscriptionStep && (
          <button
            onClick={handleSkip}
            disabled={answers[currentStep]}
            className={`px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-label text-sm font-normal ${
              answers[currentStep] ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Skip
          </button>
        )}
      </div>
      <div className="">
        {isSubscriptionStep ? (
          <SubscriptionStep
            question={steps[currentStep]?.question}
            desc={steps[currentStep]?.desc}
            content={steps[currentStep]?.content}
            onContinue={handleContinue}
          />
        ) : (
          <Onboarding
            question={steps[currentStep]?.question}
            subType={steps[currentStep]?.subType}
            desc={steps[currentStep]?.desc}
            options={steps[currentStep]?.options}
            selectedOption={answers[currentStep]}
            onOptionClick={handleOptionClick}
            onContinue={handleContinue}
          />
        )}
      </div>
      <Toaster
        open={common.toaster.visible}
        messageData={common.toaster.messageData}
      />
    </div>
  );
};

export default OnboardingLayout;
