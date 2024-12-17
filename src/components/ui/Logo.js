import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

const Logo = ({ logo, width, height, className, childClass }) => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  return (
    <div className={className}>
      <Link href={ROUTES.CHAT.path}>
        <Image
          src={`/svgs/${darkMode ? "logo-white" : "logo-dark"}.svg`}
          alt={`Bind AI`}
          width={width}
          height={height}
          className={childClass}
        />
      </Link>
    </div>
  );
};

export default Logo;
