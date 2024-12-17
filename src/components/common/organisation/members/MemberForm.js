import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "../../Icon";
import Image from "next/image";

const MemberForm = () => {
  const [memberEmail, setMemberEmail] = useState("");
  const [selectAccessClicked, setSelectAccessClicked] = useState(false);
  const [changeAccessClicked, setChangeAccessClicked] = useState(false);
  const [accessType, setAccessType] = useState("Full access");
  const [changeAccessType, setChangeAccessType] = useState("Owner");

  const sidebarOpen = useSelector((state) => state.common.sidebarCollapsed);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const access = ["Owner", "Billing", "Create Bot", "Something Else"];

  const handleChange = (event) => {
    setMemberEmail(event.target.value);
  };

  const handleAccessSelect = (access) => {
    setAccessType(access);
    setSelectAccessClicked(false);
  };

  const handleChangeAccessSelect = (access) => {
    setChangeAccessType(access);
    setChangeAccessClicked(false);
  };

  return (
    <div
      className={`w-full h-[calc(100vh-70px)] overflow-y-scroll rounded-xl bg-[#fafafa] dark:bg-darkSecondary dark:border border-[#3A4363] px-3 md:pl-6 pt-6`}
    >
      <div className="relative">
        <p className="text-[20px] font-medium dark:text-white">Team</p>
        <p className="mt-4 text-primary text-[16px] dark:text-white">
          Add a new member to the team
        </p>
        <div className="flex mt-2 md:flex-row flex-col gap-2 md:gap-0">
          <div className="md:w-2/5 flex bg-white border border-[#E4E5EA] rounded-md relative justify-between">
            <Input
              type="email"
              placeholder="Enter team member email"
              onChange={handleChange}
              name="email"
              variant="borderless"
              className={`pl-3 h-full font-medium text-[25px] text-primary w-[50%]`}
              inputStyle={"h-[49px]"}
              value={memberEmail}
            />
            <div
              className={`flex items-center text-label cursor-pointer relative mr-2`}
              onClick={() => {
                setSelectAccessClicked(!selectAccessClicked);
              }}
            >
              <p className="mr-2 text-[16px] text-label text-nowrap">
                {accessType}
              </p>
              <Image
                src={`/images/chevron-down.png`}
                alt="select"
                width={17}
                height={17}
              />
              {selectAccessClicked && (
                <div className="access-popup py-4 px-[6px] bg-[#fafafa] absolute top-[calc(100%+4px)] md:left-0 cursor-pointer z-10">
                  <p className="text-primary text-[14px] font-medium pl-[10px] py-[6px]">
                    Select access
                  </p>
                  {access.map((item) => (
                    <p
                      key={item}
                      className="text-primary text-[14px] font-medium py-[6px] pl-[10px] hover:bg-[#E4E5EA] hover:rounded-md"
                      onClick={() => handleAccessSelect(item)}
                    >
                      {item}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Button variant="tertiary" size="large" className={"w-full md:ml-2"}>
            Add member
          </Button>
        </div>
        <p className="md:w-2/5 text-sm text-label mt-2 font-normal dark:text-white">
          User topmanager@gmail.com will get full access to: Bots, Integrations,
          Vector Indexes, Plugins, List of team members, Billing, and Account
          analytics. A user with “Full Access” can add new and delete members
          from the team.
        </p>
      </div>
      <div className="mt-9">
        <p className="text-[20px] font-medium dark:text-white">Team</p>
        <div className="mt-4 md:w-[55%] dark:text-white">
          <div className="flex justify-between mb-4 text-primary text-[16px] font-medium dark:text-white">
            <p>User</p>
            <p>Access type</p>
          </div>
          <hr />
          <div className="flex justify-between my-4 cursor-pointer relative">
            <p className="text-[16px] font-medium text-label dark:text-white">
              account1owner@gmail.com
            </p>
            <div
              className="flex items-center relative"
              onClick={() => setChangeAccessClicked(!changeAccessClicked)}
            >
              <p className="hover:underline mr-1 text-[16px] font-normal text-label dark:text-white">
                {changeAccessType}
              </p>
              <Image
                src={`${
                  darkMode
                    ? "/svgs/chevron-down.svg"
                    : "/images/chevron-down.png"
                }`}
                alt="select"
                width={17}
                height={17}
              />
              {changeAccessClicked && (
                <div className="absolute access-popup pt-4 pb-10 px-[6px] top-[calc(100%+6px)] left-0 bg-[#fafafa] cursor-pointer z-10">
                  <p className="text-primary text-[14px] font-medium pl-[10px] py-[6px]">
                    Change access
                  </p>
                  {access.map((item) => (
                    <p
                      key={item}
                      className="text-primary text-[14px] font-medium py-[6px] pl-[10px] hover:bg-[#E4E5EA] hover:rounded-md"
                      onClick={() => handleChangeAccessSelect(item)}
                    >
                      {item}
                    </p>
                  ))}
                  <hr />
                </div>
              )}
            </div>
          </div>
          <hr />
        </div>
      </div>
      <style jsx>
        {`
          .access-popup {
            width: 200px;
            border: 1px solid #e4e5ea;
            border-radius: 12px;
          }
          .access-popup::before,
          .access-popup::after {
            content: "";
            position: absolute;
            bottom: 100%;
            left: 20%;
            border-style: solid;
            display: block;
            width: 0;
          }

          .access-popup::before {
            border-width: 10px;
            border-color: transparent transparent #e4e5ea transparent;
            margin-left: -10px;
          }

          .access-popup::after {
            border-width: 9px;
            border-color: transparent transparent #fafafa transparent;
            margin-left: -9px;
          }
        `}
      </style>
    </div>
  );
};

export default MemberForm;
