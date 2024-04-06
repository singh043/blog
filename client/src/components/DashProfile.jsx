/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "./../firebase";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "",
  });
  const filePickerRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadProgress] =
    useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value.trim() };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    var file_type = file.type;
    file_type = file_type.toLowerCase();
    file_type = file_type.substr(0, file_type.indexOf("/"));

    setImageFileUploadProgress(null);
    setImageFileUploadError(null);

    if (file && file_type === "image") {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      uploadImage(e.target.files[0]);
    } else if (file_type !== "image") {
      setImageFileUploadError("Please upload a image file.");
    }
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const uploadImage = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Could not upload image");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImageFileUploadError(null);
          setImageFileUploadProgress(null);
        });
      }
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="max-w-lg p-3 w-full">
        <h1 className="text-3xl font-semibold my-7 text-center">Profile</h1>
        <form
          className="flex flex-col items-center gap-5"
          onSubmit={handleSubmit}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
            className=""
          />
          <div
            className="w-32 h-32 rounded-full overflow-hidden shadow-md cursor-pointer relative"
            onClick={() => filePickerRef.current.click()}
          >
            {imageFileUploadingProgress && (
              <CircularProgressbar
                value={imageFileUploadingProgress || 0}
                text={`${imageFileUploadingProgress}%`}
                strokeWidth={3}
                styles={{
                  root: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${
                      imageFileUploadingProgress / 100
                    })`,
                  },
                }}
              />
            )}
            <img
              src={imageFileUrl || currentUser.profilePicture}
              alt="Profile Picture"
              className={`w-full h-full rounded-full object-cover border-4 border-[lightgray]
              ${
                imageFileUploadingProgress &&
                imageFileUploadingProgress < 100 &&
                "opacity-60"
              }`}
            />
          </div>
          {imageFileUploadError && (
            <div className="text-center mt-5 bg-red-300 p-2 rounded-md select-text w-[400px] ">
              {imageFileUploadError}
            </div>
          )}
          <input
            type="text"
            name="username"
            value={formData.username}
            spellCheck={false}
            onChange={handleChange}
            className="w-full h-10 border-2 border-black/40 rounded-md px-4 py-2 outline-blue-700"
          />
          <input
            type="text"
            name="email"
            value={formData.email}
            spellCheck={false}
            onChange={handleChange}
            className="w-full h-10 border-2 border-black/40 rounded-md px-4 py-2 outline-blue-700"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            spellCheck={false}
            onChange={handleChange}
            className="w-full h-10 border-2 border-black/40 rounded-md px-4 py-2 outline-blue-700"
          />
          <button
            className="border-none outline-none w-full h-10 font-semibold rounded-lg
            bg-gradient-to-r from-cyan-500 to-purple-500 text-white p-[2px] px-[3px]"
            type="submit"
          >
            <div className="w-full h-full rounded-md bg-white hover:bg-transparent hover:text-white text-black flex items-center justify-center">
              Update
            </div>
          </button>
        </form>
        <div className="mt-5 flex justify-between text-red-500 font-semibold">
          <span className="cursor-pointer">Delete Account</span>
          <span className="cursor-pointer">Sign out</span>
        </div>
      </div>
    </div>
  );
}
