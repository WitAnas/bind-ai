import React from "react";

const InputModelPopup = ({
  children,
  popupPosition,
  heading,
  headingIcon,
  footer,
  footerTextColor,
  footerIcon,
  closePopup,
  onFooterClick,
  width,
}) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-15 z-10 cursor-default"
        onClick={closePopup}
      ></div>
      <div
        className={`absolute ${
          popupPosition ? popupPosition : "right-0 "
        } bg-white dark:bg-darkPopup rounded-xl shadow-lg z-10 border dark:border-[#ffffff1e] border-lightBorder  w-max ${
          width && `w-[${width}]`
        } `}
      >
        {/* heading div */}
        {heading && (
          <div className="flex flex-col px-3 pt-4 pl-4">
            <div className="flex items-center">
              {headingIcon && headingIcon}
              <div className="font-[Inter] text-label text-sm dark:text-[#ffffffde] text-wrap">
                {heading}
              </div>
            </div>
            <div className="bg-[#e4e5ea] dark:bg-[#ffffff13] h-[1px] mt-4"></div>
          </div>
        )}

        {/* main Content */}
        <div className={`${!heading && "pt-2"}`}>{children}</div>

        {/* bottom div */}
        {footer && (
          <div
            className="flex items-center p-3"
            onClick={onFooterClick && onFooterClick}
          >
            {footerIcon && footerIcon}
            <span
              className={`text-sm font-normal font-[Inter] ${
                footerTextColor ? `text-[${footerTextColor}]` : "text-primary"
              } dark:text-${
                footerTextColor ? `[${footerTextColor}]` : "white"
              }`}
            >
              {footer && footer}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default InputModelPopup;
