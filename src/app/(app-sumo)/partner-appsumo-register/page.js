import dynamic from "next/dynamic";
import React from "react";
const Register = dynamic(
  () => import("@/features/sumo-app/components/Register"),
  {
    ssr: false,
  }
);

const page = () => {
  return (
    <>
      <Register />
    </>
  );
};

export default page;
