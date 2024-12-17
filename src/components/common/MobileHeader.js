import Logo from "../ui/Logo";
import Image from "next/image";
import Icon from "./Icon";
import { useSelector } from "react-redux";

const MobileHeader = ({ onClick }) => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  return (
    <div className="flex justify-between items-center">
      <Logo width={95} height={30} className="py-6 pl-4" />
      <Icon
        type={"cross"}
        fill={darkMode && "white"}
        className="mr-5 sm:block md:hidden cursor-pointer"
        onClick={onClick}
      />
    </div>
  );
};

export default MobileHeader;
