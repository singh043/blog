import { useEffect, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { VscChromeClose } from "react-icons/vsc";
import ClickAwayListener from "react-click-away-listener";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';

const UpdatePost = () => {

    const navigate = useNavigate();
    const { postId } = useParams();
    const [file, setFile] = useState(null);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const { currentUser } = useSelector((state) => state.user);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);

    useEffect(() => {
        try {
          const fetchPost = async () => {
            const res = await fetch(`/api/post/getposts?postId=${postId}`);
            const data = await res.json();
            if (!res.ok) {
              console.log(data.message);
              setPublishError(data.message);
              return;
            }
            if (res.ok) {
              setPublishError(null);
              if(data.posts[0].category.toLowerCase() !== 'uncategorized') {
                setSelectedOption(data.posts[0].category)
              }
              setFormData(data.posts[0]);
            }
          };
    
          fetchPost();
        } catch (error) {
          console.log(error.message);
        }
    }, [postId]);

    const handleUploadImage = async () => {
        try {
            if(!file) {
                setImageUploadError('Please select an image');
                return;
            }
            setImageUploadError(null);
            setImageUploadProgress(null);

            const storage = getStorage(app);
            const fileName = new Date().getTime() + '_' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                //eslint-disable-next-line
                (error) => {
                    setImageUploadError('Image upload failed');
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({...formData, image: downloadURL})
                    })
                }
            )
        } catch (error) {
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
           }) 
           const data = await res.json();
           if(!res.ok) {
            setPublishError(data.message);
            return
           }
           if(data.success === false){
            setPublishError(data.message);
            return;
           }
           if(res.ok) {
            setPublishError(null);
            navigate(`/post/${data.slug}`)
           }
        } catch (error) {
            setPublishError('Something went wrong');
        }
    }

    return (
        <div className="min-h-screen max-w-3xl mx-auto p-3">
            <h1 className="text-center font-semibold text-3xl my-7">Update Post</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <input
                        required
                        type="text"
                        id="title"
                        placeholder="Title"
                        className="flex-1 rounded-md px-4 py-2 h-11 outline-none border-2 border-black/40 bg-gray-100"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        value={formData?.title}
                    />
                    <ClickAwayListener onClickAway={() => setOpen(false)} >
                        <div
                            className={`rounded-md h-11 outline-none border-2 border-black/40 bg-gray-100 z-50 text-black cursor-pointer ${ selectedOption ? "border-blue-700" : ""}`}
                            onClick={() => setOpen(!open)}
                        >
                            <div className={`flex justify-between gap-2 pl-4 pr-2 pt-2 h-full rounded-md`}>
                                <span>{selectedOption === null ? "Select a category" : selectedOption}</span>
                                <span className="relative top-[3.5px]">
                                    {open ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
                                </span>
                            </div>
                            <ul className={`bg-white mt-1 min-w-[180px] overflow-y-auto rounded-md ${open ? "max-h-60 border-2 border-black/40" : "max-h-0"}`}>
                                <li className={`py-2 px-4 w-full bg-gray-100 ${ selectedOption === "javascript" ? "bg-teal-500  text-white" : "cursor-pointer" }`} 
                                    onClick={() => { 
                                        if(selectedOption === null || selectedOption !== "javascript"){
                                            setSelectedOption("javascript")
                                            setFormData({...formData, category: "javascript"})
                                        }
                                    }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>javascript</span>
                                        <VscChromeClose size={16} className={`${selectedOption === "javascript" ? "inline-block cursor-pointer" : "hidden"}`}
                                            onClick={() => {
                                                setSelectedOption(null)
                                                setFormData({...formData, category: ''})
                                            }}
                                        />
                                    </div>
                                </li>
                                <li className={`py-2 px-4 w-full bg-gray-100 ${ selectedOption === "reactjs" ? " bg-teal-500  text-white" : "cursor-pointer" }`} 
                                    onClick={() => { 
                                        if(selectedOption === null || selectedOption !== "reactjs"){
                                            setSelectedOption("reactjs")
                                            setFormData({...formData, category: "reactjs"})
                                        }
                                    }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>reactjs</span>
                                        <VscChromeClose size={16} className={`${selectedOption === "reactjs" ? "inline-block cursor-pointer" : "hidden"}`}
                                            onClick={() => {
                                                setSelectedOption(null)
                                                setFormData({...formData, category: ''})
                                            }}
                                        />
                                    </div>
                                </li>
                                <li className={`py-2 px-4 w-full bg-gray-100 ${ selectedOption === "nextjs" ? " bg-teal-500  text-white" : "cursor-pointer" }`} 
                                    onClick={() => { 
                                        if(selectedOption === null || selectedOption !== "nextjs"){
                                            setSelectedOption("nextjs")
                                            setFormData({...formData, category: "nextjs"})
                                        }
                                    }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>nextjs</span>
                                        <VscChromeClose size={16} className={`${selectedOption === "nextjs" ? "inline-block cursor-pointer" : "hidden"}`}
                                            onClick={() => {
                                                setSelectedOption(null)
                                                setFormData({...formData, category: ''})
                                            }}
                                        />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </ClickAwayListener>
                </div>
                <div className="flex justify-between items-center p-3 border-4 border-dotted border-teal-500">
                    <input type="file" accept="image/*" className="outline-none rounded-[10px] text-[16px] bg-white cursor-pointer" onChange={(e) => {
                        setImageUploadError(null);
                        setImageUploadProgress(null);

                        const file = e.target.files[0]
            
                        var file_type = file.type;
                        file_type = file_type.toLowerCase();
                        file_type = file_type.substr(0, file_type.indexOf("/"));
                    
                        if (file_type !== "image") {
                            setImageUploadError("Please upload a image file.");
                            return;
                        }
                        setFile(e.target.files[0]);
                        // e.target.value = '';
                    }} />
                    <button type="button" className={`rounded-md p-[1.5px] font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 
                    ${imageUploadProgress && 'cursor-not-allowed'} w-[130px]`}
                    disabled={imageUploadProgress}
                    onClick={handleUploadImage}>
                        <div className={`bg-white ${imageUploadProgress ? "" : "hover:text-white hover:bg-transparent"} py-2 px-3 rounded-md`}>{
                            imageUploadProgress ? <div className="">
                                {`${imageUploadProgress}%`}
                            </div> : 'Upload Image'
                        }</div>
                    </button>
                </div>
                {
                    imageUploadError && (
                        <div className="text-center mt-5 bg-red-300 p-2 rounded-md select-text w-full">
                            {imageUploadError}
                        </div>
                    )
                }
                {formData?.image && (
                    <img 
                        src={formData?.image}
                        alt="upload"
                        className="w-full h-72 object-cover"
                    />
                )}
                <ReactQuill theme="snow" placeholder="Write something...." required className="h-72 mb-12" 
                    onChange={(value) => {
                        setFormData({...formData, content: value})
                    }}
                    value={formData?.content}
                />
                <button type="submit" className={`border-none outline-none w-full h-10 font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white ${imageUploadProgress && "cursor-not-allowed"} `} disabled={imageUploadProgress} >Update post</button>
                {
                    publishError && <div className="text-center mt-5 bg-red-300 p-2 rounded-md select-text w-full">
                        {publishError}
                    </div>
                }
            </form>
        </div>
    );
};

export default UpdatePost;
