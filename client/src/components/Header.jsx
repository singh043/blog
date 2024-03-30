import { Link, useLocation } from "react-router-dom";
import Button from "./Button";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { SlMenu } from "react-icons/sl";
import { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { useSelector } from 'react-redux';
import Avatar from "./Avatar";

export default function Header() {
  
  const path = useLocation().pathname;
  const { currentUser } = useSelector(state => state.user);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);

  return (
    <nav className=" flex items-center justify-between px-[4%] h-20
        shadow-md ">
      <Link
        to="/"
        className=" self-center whitespace-nowrap text-2xl font-semibold 
                    dark:text-white text-teal-500"
      >
        <span className="pl-2 text-teal-500 ">Flick&apos;s Blog</span>
      </Link>
      <form>
        <div className="relative hidden lg:flex">
          <input
            type="text"
            placeholder="Search..."
            spellCheck={false}
            className=" w-[250px] h-10 outline-none rounded-md px-3 py-4 border-2 
                    border-black/60 text-gray-700"
          />
          <AiOutlineSearch
            size={18}
            className=" absolute right-2 top-[10px] text-gray-600 "
          />
        </div>
      </form>
      <Button
        icon={<AiOutlineSearch size={18} />}
        onClick={() => {}}
        className=" lg:hidden text-gray-600 "
      />
      <div
        className="items-center justify-center gap-4 md:gap-8 font-semibold
            sm:flex hidden"
      >
        <Link to="/" className={`${path === "/" ? "text-green-400" : "text-black"}`} >Home</Link>
        <Link to="/about" className={`${path === "/about" ? "text-green-400" : "text-black"}`} >About</Link>
        <Link to="/projects" className={`${path === "/projects" ? "text-green-400" : "text-black"}`} >Projects</Link>
      </div>
      <div className=" flex items-center gap-4 ml-4 sm:ml-0 ">
        <Button icon={<FaMoon size={14} />} className="" />
        {
          currentUser ? (
            <div className="relative">
              <Avatar user={currentUser} size="large" onClick={() => setShowDropDown(!showDropDown)} />
              {
                showDropDown && (
                  <div className="absolute top-12 right-0 rounded-md flex flex-col divide-y-2 box-shadow bg-white w-[200px]">
                    <span className="px-6 py-2 text-sm">@{currentUser.username}</span>
                    <span className="px-6 py-2 text-sm font-medium truncate ">{currentUser.email}</span>
                    <Link to={'/dashboard?tab=profile'} className="px-6 py-2 hover:bg-black/10  cursor-pointer">Profile</Link>
                    <span className="px-6 py-2 hover:bg-black/10  cursor-pointer">Sign Out</span>
                  </div>
                )
              }
            </div>
          ) : (
            <Link to="/sign-in">
              <Button
                label="Sign in"
                className=" w-20 h-10 border-none bg-green-400 text-white rounded-md "
              />
            </Link>
          )
        }
        <span
          className="hover:bg-gray-200 rounded-md w-10 h-10 flex items-center 
            justify-center cursor-pointer sm:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {!showMobileMenu ? (
            <SlMenu size={18} className="" />
          ) : (
            <VscChromeClose size={20} />
          )}
        </span>
      </div>
      {showMobileMenu && (
        <div
          className="absolute left-0 top-[81px] flex flex-col w-full bg-white shadow-lg
            sm:hidden font-semibold"
        >
          <Link
            to="/"
            className={`${path === "/" ? "bg-green-400 text-white" : "hover:bg-gray-400" }
                py-3 px-6`}
            onClick={() => setShowMobileMenu(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`${path === "/about" ? "bg-green-400 text-white" : "hover:bg-gray-400" } py-3 px-6`}
            onClick={() => setShowMobileMenu(false)}
          >
            About
          </Link>
          <Link
            to="/projects"
            className={`${path === "/projects" ? "bg-green-400 text-white" : "hover:bg-gray-400" } py-3 px-6`}
            onClick={() => setShowMobileMenu(false)}
          >
            Projects
          </Link>
        </div>
      )}
    </nav>
  );
}
