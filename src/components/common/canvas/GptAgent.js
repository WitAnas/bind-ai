import InputModelPopup from "@/features/chat/components/InputModelPopup";
import {
  clearCustomUserBot,
  fetchUserBots,
  setCustomUserBot,
} from "@/redux/reducers/botReducer";
import { showPopup, showToaster } from "@/redux/reducers/commonReducer";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import DeleteConfirmPopup from "./DeleteConfirmPopup";
import axios from "axios";

const GptAgent = ({ agent, onEdit }) => {
  const [openPopup, setOpenPopup] = useState(false);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const customUserBot = useSelector((state) => state.bot.customUserBot);

  const closePopup = () => {
    setOpenPopup(false);
  };

  const handleDelete = () => {
    dispatch(
      showPopup({
        title: "",
        description: (
          <DeleteConfirmPopup
            agent={agent}
            handleDeleteAgent={handleDeleteAgent}
          />
        ),
        btnArray: [],
        classAdditions: {
          popupContainer: `
         w-[400px] 
        `,
          popup:
            " !w-full !border dark:border-[#ffffff1e] border-[#E4E5EA] dark:bg-[#26282c] p-7",
        },
      })
    );
  };

  const handleDeleteAgent = async () => {
    try {
      const params = new URLSearchParams();
      params.append("botId", agent.id);

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_NEW_BACKEND_URL}/bot/delete`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: params,
        }
      );

      if (response?.data?.status === "success") {
        dispatch(
          showToaster({
            variant: "success",
            title: "Agent deleted successfully",
            description: "",
          })
        );

        dispatch(fetchUserBots(currentUser?.uid));
        if (customUserBot?.id === agent.id) {
          dispatch(clearCustomUserBot());
        }

        const agentRoute = `/chat/${agent?.bname
          .toLowerCase()
          .replace(/\s+/g, "-")}`;
        if (pathname === agentRoute) {
          router.push("/chat/661cacc79657814effd8db6c");
        }
      }
    } catch (error) {
      console.log("error in deleting bot ", error);
      dispatch(
        showToaster({
          variant: "error",
          title: "Failed to delete agent",
          description: "",
        })
      );
    }
  };

  const handleUseAgent = () => {
    router.push(`/chat/${agent?.bname.toLowerCase().replace(/\s+/g, "-")}`);
    dispatch(setCustomUserBot(agent));
  };
  return (
    <div className="py-4 pl-4 pr-3 mb-1 border border-lightBorder rounded-lg bg-white dark:bg-darkTextArea  dark:border-[#ffffff23]">
      <div className="flex justify-between items-start  w-full">
        <div className="w-[95%]">
          <h3
            className="font-medium text-base text-[#131314] dark:text-white truncate  w-[70%] hover:underline"
            style={{ textUnderlineOffset: "4px" }}
          >
            {agent?.bname}
          </h3>
          <p className="text-sm font-normal text-[#131314] mt-1 dark:text-white truncate w-full">
            {agent?.base || "No description"}
          </p>
        </div>
        <div className="relative">
          <div
            className="cursor-pointer text-[#757575] hover:text-gray-600"
            onClick={() => setOpenPopup(true)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </div>
          {openPopup && (
            <InputModelPopup
              heading={`Delete ${agent?.bname} agent`}
              popupPosition={`top-0 right-5`}
              closePopup={closePopup}
              width={"290px"}
            >
              <div className=" flex flex-col mt-2">
                <div
                  className="flex items-center hover:dark:bg-white12 hover:bg-[#e4e5ea] px-3 py-[10px] pl-4 cursor-pointer"
                  onClick={() => {
                    handleDelete();
                    setOpenPopup(false);
                  }}
                >
                  <MdDelete
                    size={17}
                    className=" dark:text-white text-primary mr-2"
                  />

                  <span className=" text-primary font-medium  text-sm dark:text-white">
                    Delete
                  </span>
                </div>
              </div>
              <div className="bg-[#e4e5ea] dark:bg-[#ffffff13] h-[1px] mt-2 mx-3"></div>
            </InputModelPopup>
          )}
        </div>
      </div>
      <div className="flex gap-4 mt-3.5">
        <div
          className="py-2 px-3 border border-lightBorder rounded-lg  flex gap-1.5 items-center cursor-pointer  transition-all duration-200 hover:bg-[#f5f5f5] dark:hover:bg-[#3a3d42] hover:border-[#d0d1d6] dark:hover:border-[#ffffff40]"
          onClick={handleUseAgent}
        >
          <FaCirclePlay
            width={14}
            height={14}
            className="w-3.5 h-3.5 text-[#000] dark:text-white"
          />
          <p className="text-[#131314] font-normal text-sm  dark:text-white">
            Use Agent
          </p>
        </div>
        <div
          className="flex gap-1.5 items-center cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 -mx-1 hover:text-[#000] dark:hover:text-[#fff] group relative"
          onClick={() => onEdit(agent)}
        >
          <MdEdit
            width={17}
            height={17}
            className="w-4 h-4 text-[#212121] dark:text-white transition-transform duration-200 group-hover:scale-110 group-hover:text-[#000] dark:group-hover:text-[#fff]"
          />
          <p className="text-[#212121] font-normal text-sm dark:text-white relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-current after:transition-all after:duration-200 group-hover:after:w-full group-hover:text-[#000] dark:group-hover:text-[#fff]">
            Edit
          </p>
        </div>
      </div>
    </div>
  );
};

export default GptAgent;
