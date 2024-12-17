"use client";
import LoginForm from "@/components/common/login/LoginForm";
import RegisterForm from "@/components/common/register/RegisterForm";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const Register = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  return (
    <div className="mt-5 md:mt-0">
      <div className="flex justify-center items-center bg-white md:bg-[#f2f3f8] h-screen ">
        <div className="flex md:scale-[0.85] w-[80%] ">
          <div className="flex-1 md:shadow-[0_2px_24px_0_rgba(28,39,76,0.12)] w-full">
            <RegisterForm origin={"AppSumo"} code={code} />
          </div>
          <div className=" flex-1 hidden md:block">
            <div className="pl-[105px]">
              <Image
                src={`/svgs/logo-dark.svg`}
                alt={`Bind AI logo`}
                width={187}
                height={60}
                quality={100}
                className="w-44 h-11"
              />
              <h2 className="text-primary font-semibold text-[28px] font-[Inter,sans-serif] mt-20">
                Welcome Sumo-lings!
              </h2>
              <p className="text-primary text-lg font-normal mt-1.5">
                Sign up to access your AppSumo license
              </p>
              <div className="mt-9 pl-2 flex flex-col gap-9">
                <div className=" flex  gap-4 ">
                  <FaCheckCircle
                    size={20}
                    className="text-primary h-5 w-5 mt-1"
                  />
                  <div>
                    <h3 className="text-primary font-semibold text-xl font-[Inter,sans-serif]">
                      Advanced AI Models
                    </h3>
                    <p className="text-primary font-normal text-lg ">
                      GPT 4o, Claude, Mistral, Cohere, LLama
                      <br /> models
                    </p>
                  </div>
                </div>
                <div className=" flex  gap-4">
                  <FaCheckCircle
                    size={20}
                    className="text-primary h-5 w-5 mt-1"
                  />
                  <div>
                    <h3 className="text-primary font-semibold text-xl font-[Inter,sans-serif]">
                      Connect your data
                    </h3>
                    <p className="text-primary font-normal text-lg ">
                      Access Github and Google Drive integration
                      <br /> for Tier 2 and Tier 3
                    </p>
                  </div>
                </div>
                <div className=" flex  gap-4">
                  <FaCheckCircle
                    size={20}
                    className="text-primary h-5 w-5 mt-1"
                  />
                  <div>
                    <h3 className="text-primary font-semibold text-xl font-[Inter,sans-serif]">
                      Built-in AI Code Editor
                    </h3>
                    <p className="text-primary font-normal text-lg mt-3">
                      Edit and execute your code within Bind AI.
                    </p>
                  </div>
                </div>
              </div>

              <Image
                src="/svgs/arrow.svg"
                alt="arrow"
                height={100}
                width={100}
                quality={100}
                className="mt-9 h-11 w-11"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
