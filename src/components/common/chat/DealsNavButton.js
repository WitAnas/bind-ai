import Button from "@/components/ui/Button";
import React from "react";

const DealsNavButton = ({ buttonText, deal, handleDealsNavButtonClick }) => {
  return (
    <>
      <Button
        variant="primary"
        size="medium"
        className={`group relative overflow-hidden transition-all duration-300  !px-4 !rounded-lg border ${
          deal == "second"
            ? "dark:!bg-[#5f5f60] !border-none !bg-[#363668]"
            : "!border-[#745ffb] !bg-transparent dark:!border-[#faff69] hover:shadow-lg hover:shadow-[#745ffb]/20 dark:hover:shadow-[#faff69]/20"
        } `}
        onClick={handleDealsNavButtonClick}
      >
        {/* Background animation on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-[#745ffb] to-[#a291ff] dark:from-[#faff69] dark:to-[#fff9c0]" />

        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-700 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white to-transparent" />

        <span
          className={`relative flex items-center gap-2 text-sm font-[Inter,sans-serif] font-medium ${
            deal == "second"
              ? "text-white dark:font-medium font-semibold"
              : "text-[#745ffb] dark:text-[#faff69]"
          } transform  transition-transform duration-300`}
        >
          <span className="animate-pulse text-lg font-bold">
            {deal == "second" ? "👨‍💻" : "🌟"}
          </span>
          {buttonText}
        </span>
      </Button>
    </>
  );
};

export default DealsNavButton;
