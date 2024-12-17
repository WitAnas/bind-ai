import { hidePopup } from "@/redux/reducers/commonReducer";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineClose } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";
import { useState } from "react";

const DeleteConfirmPopup = ({ agent, handleDeleteAgent, thread }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await handleDeleteAgent();
    } catch (error) {
      console.log("Delete failed:", error);
    } finally {
      setIsDeleting(false);
      dispatch(hidePopup());
    }
  };

  return (
    <>
      <div className="flex justify-between ">
        {" "}
        <h3
          className={`text-[16px] font-[500] text-primary dark:text-white font-[Inter]`}
        >
          {` Delete ${agent?.bname ? agent?.bname : thread ? "thread" : agent}`}
        </h3>
        {darkMode ? (
          <MdOutlineClose
            size={20}
            className="cursor-pointer  text-[#ffffff61]"
            onClick={() => dispatch(hidePopup())}
          />
        ) : (
          <Image
            src="/images/cross.png"
            alt="close"
            width={24}
            height={24}
            className="block cursor-pointer"
            onClick={() => dispatch(hidePopup())}
          />
        )}
      </div>

      <div className="flex flex-col gap-4 mt-5">
        <div className="border border-[#e0425d] rounded py-2 pl-2 bg-[#e0425d14] flex flex-col gap-4">
          <div className="flex items-center ">
            <RiErrorWarningFill
              size={20}
              className="cursor-pointer  text-[#e0425d]  mr-2"
            />
            <div className="font-[Inter] text-label font-normal text-sm dark:text-[#fff]">
              {`Are you sure you want to delete this ${
                thread ? "thread" : "agent"
              }?`}
            </div>
          </div>
          <p className="font-[Inter] text-label font-normal text-sm dark:text-[#fff] mb-1 pl-6">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-2">
          <div
            className="bg-[#E4E5EA] dark:bg-darkBotPrimary text-[16px] font-medium font-[Inter]   dark:text-white py-3.5 rounded-lg w-full text-center hover:brightness-90"
            onClick={() => !isDeleting && dispatch(hidePopup())}
          >
            Cancel
          </div>
          <div
            className={` bg-[#97464c]
             text-[16px] font-medium font-[Inter] text-white py-3.5 rounded-lg w-full text-center hover:brightness-90`}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                Deleting...
              </div>
            ) : (
              "Yes, delete"
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmPopup;
