import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { FaComments, FaLongArrowAltRight, FaUser, FaUsers } from "react-icons/fa";
import { HiChartPie, HiDocumentText } from 'react-icons/hi';

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-2 text-[16.5px] text-black/60">
      {
        currentUser && currentUser.isAdmin && (
          <Link to='/dashboard?tab=dashboard' className={`flex relative gap-3 items-center p-2 rounded-lg h-11 ${
              tab === "comments" || !tab ? "bg-black/5 text-black" : "hover:bg-black/5"
            } `}>
            <HiChartPie size={24} />
            <span>Dashboard</span>
          </Link>
        )
      }
      <Link
        to="/dashboard?tab=profile"
        className={`flex relative gap-3 items-center p-2 rounded-lg h-11 ${
          tab === "profile" ? "bg-black/5 text-black" : "hover:bg-black/5"
        } `}
      >
        <FaUser size={24} />
        <span className="cursor-pointer">Profile</span>
        <label
          className="absolute right-2 bg-[#4b5563] rounded-md text-white text-[13px] 
                font-semibold px-2 py-[1px] "
        >
          { currentUser?.isAdmin ? "Admin" : "User" }
        </label>
      </Link>
      {
        currentUser?.isAdmin && (
          <>
            <Link to='/dashboard?tab=users' className={`flex relative gap-3 items-center p-2 rounded-lg h-11 ${
                tab === "users" ? "bg-black/5 text-black" : "hover:bg-black/5"
              } `}>
              <FaUsers  size={26} />
              <span>Users</span>
            </Link>
            <Link to='/dashboard?tab=posts' className={`flex relative gap-3 items-center p-2 rounded-lg h-11 ${
                tab === "posts" ? "bg-black/5 text-black" : "hover:bg-black/5"
              } `}>
              <HiDocumentText size={26} />
              <span>Posts</span>
            </Link>
            <Link to='/dashboard?tab=comments' className={`flex relative gap-3 items-center p-2 rounded-lg h-11 ${
                tab === "comments" ? "bg-black/5 text-black" : "hover:bg-black/5"
              } `}>
              <FaComments size={24} />
              <span>Comments</span>
            </Link>
          </>
        )
      }
      <div
        className="flex gap-3 items-center p-2 rounded-lg h-11 hover:bg-black/5 cursor-pointer"
        onClick={handleSignOut}
      >
        <FaLongArrowAltRight size={26} className="" />
        <span>Sign out</span>
      </div>
    </div>
  );
}
