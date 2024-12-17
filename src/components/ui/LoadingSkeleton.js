import { useClientMediaQuery } from "@/features/hooks";
import React from "react";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";

export const ProfileSkeleton = () => {
  return (
    <div className="px-6 py-6">
      <SkeletonTheme baseColor="#ECEAFF" highlightColor="white">
        <div className="flex justify-between mb-4">
          <Skeleton width="30%" height={24} />
          <Skeleton width={24} height={24} className="cursor-pointer" />
        </div>

        <div className="border border-[#F1F2F5] flex items-center rounded-xl mt-6">
          <Skeleton
            circle={true}
            width={45}
            height={45}
            className="ml-2 my-2"
          />
          <Skeleton width="50%" height={24} className="ml-4" />
        </div>

        <div className="border border-[#F1F2F5] rounded-xl my-2 py-2 px-2">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center">
              <Skeleton
                circle={true}
                width={45}
                height={45}
                className="block"
              />
              <Skeleton width="50%" height={24} className="ml-4" />
            </div>
            <Skeleton width="30%" height={36} className="rounded-3xl" />
          </div>

          <Skeleton width="60%" height={24} className="my-4" />
          <Skeleton width="80%" height={24} className="my-4" />
          <Skeleton width="50%" height={24} className="my-4" />

          <Skeleton width="100%" height={36} className="my-4 rounded-lg" />

          <Skeleton width="60%" height={24} className="my-4" />
        </div>

        <div className="border border-[#F1F2F5] flex items-center justify-between rounded-xl py-2 pl-2 cursor-pointer">
          <Skeleton
            circle={true}
            width={45}
            height={45}
            className="block pr-3"
          />
          <Skeleton width="20%" height={24} className="ml-2" />
          <Skeleton width={16} height={16} className="mr-4" />
        </div>
      </SkeletonTheme>
    </div>
  );
};

const LoadingSkeleton = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <>
      <SkeletonTheme
        baseColor={darkMode ? "#333" : "#ECEAFF"}
        highlightColor={darkMode ? "#444" : "#FFFFFF"}
        enableAnimation={true}
      >
        <p>
          <Skeleton width="30%" />
        </p>
      </SkeletonTheme>
      <SkeletonTheme
        baseColor={darkMode ? "#333" : "#ECEAFF"}
        highlightColor={darkMode ? "#444" : "#FFFFFF"}
      >
        <p>
          <Skeleton width="60%" />
        </p>
      </SkeletonTheme>
      <SkeletonTheme
        baseColor={darkMode ? "#333" : "#ECEAFF"}
        highlightColor={darkMode ? "#444" : "#FFFFFF"}
      >
        <p>
          <Skeleton width="60%" />
        </p>
      </SkeletonTheme>
      <SkeletonTheme
        baseColor={darkMode ? "#333" : "#ECEAFF"}
        highlightColor={darkMode ? "#444" : "#FFFFFF"}
      >
        <p>
          <Skeleton width="15%" />
        </p>
      </SkeletonTheme>
    </>
  );
};

export default LoadingSkeleton;

export const PremiumPopupSkeleton = () => {
  const isMobile = useClientMediaQuery("(max-width: 600px)");
  return (
    <div className="md:p-10">
      <SkeletonTheme baseColor="#ECEAFF" highlightColor="white">
        <div className="flex justify-end p-3 md:p-0 md:absolute md:right-5 md:top-5">
          <Skeleton width={24} height={24} className="block cursor-pointer" />
        </div>

        <div
          className={`${
            isMobile && "fixed top-1/2 transform -translate-y-1/2"
          } p-5 md:p-0 md:static md:mt-5`}
        >
          <Skeleton
            width="40%"
            height={32}
            className="text-primary font-semibold ml-3"
          />
          <div className="md:mt-7 mt-10 ml-3">
            <Skeleton height={24} className="mb-2" />
            <Skeleton height={24} className="mb-2" />
            <Skeleton height={24} className="mb-2" />
          </div>

          <div className="md:mt-9 mt-[20%] flex flex-col md:gap-2 gap-3 ">
            <Skeleton height={48} className="w-full !rounded-lg" />
            <p className="text-sm font-normal text-primary self-center">
              <Skeleton width="40%" height={24} />
            </p>
          </div>
          <Skeleton width="80%" height={16} className="md:mt-5 mt-7 ml-2" />
        </div>
      </SkeletonTheme>
    </div>
  );
};

export const ChatSkeleton = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <SkeletonTheme
      baseColor={darkMode ? "#333" : "#ECEAFF"}
      highlightColor={darkMode ? "#444" : "#FFFFFF"}
    >
      <div className="flex flex-col gap-6 mt-8">
        <div className="msg rounded-lg my-2">
          <div className="flex gap-2 items-center text-sm">
            <Skeleton circle={true} width={28} height={28} />
            <Skeleton width={32} height={16} />
          </div>
          <div className="mt-2">
            <Skeleton width="83%" height={16} />
          </div>
          <div className="">
            <Skeleton width="75%" height={16} />
          </div>
        </div>

        <div className="pb-6 pt-2 rounded-lg my-2">
          <div className="flex gap-2 items-center text-sm">
            <Skeleton width={24} height={24} />
            <Skeleton width={64} height={16} />
          </div>
          <div className="mt-2 space-y-2">
            <Skeleton width="100%" height={16} />
            <Skeleton width="83%" height={16} />
            <Skeleton width="66%" height={16} />
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Skeleton width={16} height={16} />
              <Skeleton width={96} height={16} />
            </div>
            <div className="flex items-center gap-3 mr-4">
              <Skeleton width={16} height={16} />
              <Skeleton width={16} height={16} />
              <Skeleton width={16} height={16} />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export const AgentSkeleton = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <SkeletonTheme
      baseColor={darkMode ? "#333" : "#ECEAFF"}
      highlightColor={darkMode ? "#444" : "#FFFFFF"}
    >
      <div className="mb-4 p-4 border border-lightBorder dark:border-[#ffffff23] rounded-lg">
        <div className="flex justify-between items-start">
          <div className="space-y-2 w-full">
            <Skeleton width={180} height={20} />
            <Skeleton width={300} height={16} />
            <div className="flex gap-3 mt-4">
              <Skeleton width={90} height={32} />
              <Skeleton width={90} height={32} />
            </div>
          </div>
          <Skeleton width={24} height={24} circle />
        </div>
      </div>
    </SkeletonTheme>
  );
};
