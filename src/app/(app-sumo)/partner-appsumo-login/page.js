import dynamic from "next/dynamic";
import React from "react";
const Login = dynamic(() => import("@/features/sumo-app/components/Login"), {
  ssr: false,
});

const page = () => {
  return (
    <>
      <Login/>
    </>
  );
};

export default page;
