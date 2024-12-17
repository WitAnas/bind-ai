import { hideToaster } from "@/redux/reducers/commonReducer";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Toaster = ({ messageData, open }) => {
  const dispatch = useDispatch();
  const timer = messageData?.timer || 3000;
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (typeof messageData?.toasterCb === "function") {
          messageData.toasterCb();
        }
        dispatch(hideToaster());
      }, timer);
    }
  }, [open]);

  const iconHandler = () => {
    if (messageData?.variant === "success") {
      return "success-alert.svg";
    } else if (messageData?.variant === "error") {
      return "error-alert.svg";
    } else if (messageData?.variant === "info") {
      return "info-alert.svg";
    }
  };

  const toastClassHandler = () => {
    if (messageData?.variant === "success") {
      return "bg-success border border-[#32A234]";
    } else if (messageData?.variant === "error") {
      return "bg-error border border-[#9E1D1D]";
    } else if (messageData?.variant === "info") {
      return "bg-info border border-[#0053C9]";
    }
  };

  const icon = iconHandler();
  const toastClass = toastClassHandler();

  return (
    <>
      {open && (
        <div
          className={`toaster flex justify-center pl-5 pr-3 py-6 mr-6 bg-${messageData?.variant} ${toastClass}`}
        >
          <Image
            src={`/svgs/${icon}`}
            alt="alert"
            width={20}
            height={20}
            className="mr-2"
          />
          <p className="text-[18px] text-bold font-semibold text-primary">
            {messageData?.title}
          </p>
          {messageData?.description && (
            <p className="p-1">{messageData.description}</p>
          )}
        </div>
      )}
      <style jsx>{`
        .toaster {
          position: fixed;
          top: 5%;
          right: 0;
          color: #fff;
          border-radius: 5px;
          animation-duration: ${timer}ms;
          max-width: unset;
          z-index: 50;
        }
        @media screen and (min-width: 768px) {
          .toaster {
            max-width: 400px;
          }
        }
        @keyframes toaster-animation {
          0% {
            visibility: visible;
            top: 0px;
          }
          10% {
            top: 20px;
          }
          90% {
            top: 20px;
          }
          100% {
            top: 0px;
            visibility: hidden;
          }
        }
      `}</style>
    </>
  );
};

export default Toaster;
