"use client";
import LoginForm from "@/components/common/login/LoginForm";
import Logo from "@/components/ui/Logo";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const Login = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  return (
    <div className="">
      <div className="flex justify-center items-center bg-white md:bg-[#f2f3f8]  h-screen ">
        <div className="flex">
          <div className="flex-1 md:shadow-[0_2px_24px_0_rgba(28,39,76,0.12)]">
            <LoginForm origin={"AppSumo"} code={code} />
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
                Sign in to access your AppSumo license
              </p>
              <div className="mt-10 flex  gap-4">
                <FaCheckCircle
                  size={20}
                  className="text-primary h-5 w-5 mt-1.5"
                />
                <p className="text-primary font-normal text-lg ">
                  Don’t have an account? Create a new account
                  <br /> to access your license.
                </p>
              </div>
              <Image
                src="/svgs/arrow.svg"
                alt="arrow"
                height={100}
                width={100}
                quality={100}
                className="mt-20 h-11 w-11"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
