"use client";

import Toaster from "@/components/ui/Toaster";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function SumoLayout({ children }) {
  const common = useSelector((state) => state.common);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const router = useRouter();

  if (currentUser?.uid) {
    router.push("/");
    return;
  }

  return (
    <>
      <div>
        {children}

        <Toaster
          open={common.toaster.visible}
          messageData={common.toaster.messageData}
        />
      </div>
    </>
  );
}
