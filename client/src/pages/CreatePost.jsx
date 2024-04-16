import { useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { VscChromeClose } from "react-icons/vsc";
import ClickAwayListener from "react-click-away-listener";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {

    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    return (
        <div className="min-h-screen max-w-3xl mx-auto p-3">
            <h1 className="text-center font-semibold text-3xl my-7">Create Post</h1>
            <form className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <input
                        required
                        type="text"
                        id="title"
                        placeholder="Title"
                        className="flex-1 rounded-md px-4 py-2 h-11 outline-none border-2 border-black/40 bg-gray-100"
                    />
                    <ClickAwayListener onClickAway={() => setOpen(false)} >
                        <div
                            className={`rounded-md h-11 outline-none border-2 border-black/40 bg-gray-100 z-10 text-black cursor-pointer ${ selectedOption ? "border-blue-700" : ""}`}
                            onClick={() => setOpen(!open)}
                        >
                            <div className={`flex justify-between gap-2 pl-4 pr-2 pt-2 h-full rounded-md`}>
                                <span>{selectedOption === null ? "Select a category" : selectedOption}</span>
                                <span className="relative top-[3.5px]">
                                    {open ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
                                </span>
                            </div>
                            <ul className={`bg-white mt-1 min-w-[180px] overflow-y-auto rounded-md ${open ? "max-h-60 border-2 border-black/40" : "max-h-0"}`}>
                                <li className={`py-2 px-4 w-full bg-gray-100 ${ selectedOption === "Javascript" ? "bg-teal-500  text-white" : "cursor-pointer" }`} 
                                    onClick={() => { 
                                        if(selectedOption === null || selectedOption !== "Javascript")
                                            setSelectedOption("Javascript")
                                    }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>Javascript</span>
                                        <VscChromeClose size={16} className={`${selectedOption === "Javascript" ? "inline-block cursor-pointer" : "hidden"}`}
                                            onClick={() => setSelectedOption(null)}
                                        />
                                    </div>
                                </li>
                                <li className={`py-2 px-4 w-full bg-gray-100 ${ selectedOption === "Reactjs" ? " bg-teal-500  text-white" : "cursor-pointer" }`} 
                                    onClick={() => { 
                                        if(selectedOption === null || selectedOption !== "Reactjs")
                                            setSelectedOption("Reactjs")
                                    }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>Reactjs</span>
                                        <VscChromeClose size={16} className={`${selectedOption === "Reactjs" ? "inline-block cursor-pointer" : "hidden"}`}
                                            onClick={() => setSelectedOption(null)}
                                        />
                                    </div>
                                </li>
                                <li className={`py-2 px-4 w-full bg-gray-100 ${ selectedOption === "Nextjs" ? " bg-teal-500  text-white" : "cursor-pointer" }`} 
                                    onClick={() => { 
                                        if(selectedOption === null || selectedOption !== "Nextjs")
                                            setSelectedOption("Nextjs")
                                    }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>Nextjs</span>
                                        <VscChromeClose size={16} className={`${selectedOption === "Nextjs" ? "inline-block cursor-pointer" : "hidden"}`}
                                            onClick={() => setSelectedOption(null)}
                                        />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </ClickAwayListener>
                </div>
                <div className="flex justify-between items-center p-3 border-4 border-dotted border-teal-500">
                    <input type="file" accept="image/*" className="outline-none rounded-[10px] text-[16px] bg-white cursor-pointer" />
                    <button type="button" className="border-2 border-black rounded-md py-2 px-3 font-semibold">Upload image</button>
                </div>
                <ReactQuill theme="snow" placeholder="Write something...." required className="h-72 mb-12" />
                <button type="submit" className="border-none outline-none w-full h-10 font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white">Publish</button>
            </form>
        </div>
    );
};

export default CreatePost;
