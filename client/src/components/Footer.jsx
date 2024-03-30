import { FaInstagram, FaTwitter, FaDiscord, FaFacebook } from 'react-icons/fa';
import "../index.css";

export default function Footer() {
  return (
    <div className="flex flex-col w-full py-[30px] text-gray-600 gap-5 border-t-2 border-black ">
        <div className='flex justify-center items-center gap-[16px] sm:gap-[30px] font-semibold'>
            <span className='cursor-pointer hover:text-pink'>Terms of Use</span>
            <span className='cursor-pointer hover:text-pink'>Privacy-Policy</span>
            <span className='cursor-pointer hover:text-pink'>About</span>
            <span className='cursor-pointer hover:text-pink'>Blog</span>
            <span className='cursor-pointer hover:text-pink'>FAQ</span>
        </div>
        <div className='text-[14px] text-center text-black'>
            Copyright © 2024 Flick. All rights reserved.
        </div>
        <div className='flex gap-[10px] sm:gap-5 justify-center items-center'>
            <span className='w-[50px] h-[50px] rounded-[50%] flex items-center justify-center bg-white border-black/70 border-2 text-[20px] cursor-pointer text-black/85 hover:text-pink hover:shadow-boxShadow'><FaDiscord /></span>
            <span className='w-[50px] h-[50px] rounded-[50%] flex items-center justify-center bg-white border-black/70 border-2 text-[20px] cursor-pointer text-black/85 hover:text-pink hover:shadow-boxShadow'><FaInstagram /></span>
            <span className='w-[50px] h-[50px] rounded-[50%] flex items-center justify-center bg-white border-black/70 border-2 text-[20px] cursor-pointer text-black/85 hover:text-pink hover:shadow-boxShadow'><FaFacebook /></span>
            <span className='w-[50px] h-[50px] rounded-[50%] flex items-center justify-center bg-white border-black/70 border-2 text-[20px] cursor-pointer text-black/85 hover:text-pink hover:shadow-boxShadow'><FaTwitter /></span>
        </div>
    </div>
  )
}
