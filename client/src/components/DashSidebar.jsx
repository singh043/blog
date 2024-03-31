import { useEffect, useState } from "react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

  return (
    <div className="flex flex-col gap-2 text-[16.5px] text-black">
      <Link
        to="/dashboard?tab=profile"
        className={`flex relative gap-3 items-center p-2 rounded-lg h-11 ${
          tab === "profile" ? "bg-black/5" : ""
        } `}
      >
        <HiUser size={26} />
        <span className="cursor-pointer">Profile</span>
        <label
          className="absolute right-2 bg-[#4b5563] rounded-md text-white text-[13px] 
                font-semibold px-2 py-[1px] "
        >
          User
        </label>
      </Link>
      <div className="flex gap-3 items-center p-2 rounded-lg h-11 hover:bg-black/5 cursor-pointer">
        <HiArrowSmRight size={26} className="text-black/30" />
        <span>Sign out</span>
      </div>
    </div>
  );
}
