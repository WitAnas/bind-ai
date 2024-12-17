import Button from "@/components/ui/Button";
import React from "react";
import BindFeaturesList from "@/components/common/BindFeaturesList";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { showPopup, showToaster } from "@/redux/reducers/commonReducer";
import LoginForm from "@/components/common/login/LoginForm";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useClientMediaQuery } from "@/features/hooks";

export const handlePayment = async (currentUser, dispatch) => {
  if (!currentUser?.uid) {
    dispatch(
      showPopup({
        title: "",
        description: <LoginForm />,
        btnArray: [],
        classAdditions: {
          popupContainer: "w-11/12 md:w-2/5",
        },
      })
    );
    return;
  }

  let apiEndpoint;

  apiEndpoint = process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/checkout";

  const formData = new FormData();
  formData.append("plan", "monthly");

  if (currentUser?.uid) {
    formData.append("user_id", currentUser.uid);
  }

  const currentUrl = window.location.href;
  const url = new URL(currentUrl);

  url.search = "";

  const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}?paymentSuccess=true`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}?paymentFailed=true`;

  formData.append("success_url", successUrl);
  formData.append("cancel_url", cancelUrl);

  try {
    const response = await axios.post(apiEndpoint, formData);

    if (response?.data?.status === "success") {
      window.location.href = response.data.url;
    } else {
      dispatch(
        showToaster({
          variant: "error",
          title: "Something went wrong. Please try again after some time.",
          description: "",
        })
      );
    }
  } catch (error) {
    console.log("Error during payment:", error);
    dispatch(
      showToaster({
        variant: "error",
        title: "Something went wrong. Please try again after some time.",
        description: "",
      })
    );
  }
};

const SubscriptionStep = ({ question, desc, content, onContinue }) => {
  const isMobile = useClientMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <>
      <div className="w-full max-w-4xl  mx-auto pb-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="md:text-[28px] text-[25px] font-[600] text-primary mb-2">
            {question}
          </h1>
          <p className="md:text-lg text-[16px] font-normal mb-4 text-primary">
            {desc}
          </p>
        </div>
        {content == "premium" ? (
          <div className="md:w-[45%] mx-auto ">
            <div className="option bg-white px-8 md:py-4 rounded-lg md:h-[50vh] pt-6 pb-10">
              <div className="flex justify-center mb-5">
                <Image
                  src={"/svgs/blackDiamond.svg"}
                  alt=""
                  width={70}
                  height={70}
                />
              </div>

              <div>
                <BindFeaturesList content={content} />
              </div>
            </div>
            <div className="w-full mx-auto mt-4">
              <Button
                variant="secondary"
                size="large"
                className={`w-full  !rounded-lg !bg-darkMutedPurple text-white`}
                onClick={() => {
                  handlePayment(currentUser, dispatch);
                }}
              >
                <p className="text-[18px] font-[500]">Get 7 Day Free Trial</p>
              </Button>
              <p
                className="underline text-sm font-[400] text-[#848A9E] text-center mt-2 cursor-pointer"
                onClick={onContinue}
              >
                {" "}
                Continue with free version
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center md:flex-row flex-col gap-8">
            <div className="md:w-[45%]">
              <div className="option bg-white px-8 md:py-4 rounded-lg md:h-[85%] py-8 ">
                <h1 className="text-[28px] font-[600] text-primary mb-2">
                  Basic
                </h1>
                <p className="text-sm font-normal mb-5 text-primary">
                  Gives you limited access to models
                </p>
                <div>
                  <BindFeaturesList content={content} />
                </div>
              </div>
              <div className="w-full mx-auto mt-4">
                <Button
                  variant="secondary"
                  size="large"
                  className={`w-full !rounded-lg !bg-[#888888] text-white`}
                  onClick={() => {
                    router.push(`/`);
                  }}
                >
                  <p className="text-[18px] font-[500]">
                    Start with Basic Plan
                  </p>
                </Button>
              </div>
            </div>
            <div className="md:w-[45%]">
              <div className="option bg-white px-8 py-4 rounded-lg h-[85%]">
                <h1 className="text-[28px] font-[600] text-primary mb-2">
                  Premium
                </h1>
                <p className="text-sm font-normal mb-5 text-primary">
                  Ideal for code generation and content writing
                </p>
                <div>
                  <BindFeaturesList content={"premium"} />
                </div>
              </div>
              <div className="w-full mx-auto mt-4">
                <Button
                  variant="secondary"
                  size="large"
                  className={`w-full !rounded-lg !bg-darkMutedPurple text-white`}
                  onClick={() => {
                    handlePayment(currentUser, dispatch);
                  }}
                >
                  <p className="text-[18px] font-[500]">
                    Subscribe for $18/month
                  </p>
                </Button>
                <p
                  className="underline text-[18px] font-[700] text-[#0061FE] text-center mt-2 cursor-pointer"
                  onClick={() => {
                    handlePayment(currentUser, dispatch);
                  }}
                >
                  {" "}
                  Get a 7-day Free Trial
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>
        {`
          .option {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1),
              0 4px 8px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </>
  );
};

export default SubscriptionStep;
