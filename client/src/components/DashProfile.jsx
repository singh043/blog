/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "./../firebase";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
} from "../redux/user/userSlice";
import DeletePopup from "./DeletePopup";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const { currentUser, loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadProgress] =
    useState(null);

  const handleChange = (e) => {
    setUpdateUserSuccess(null);
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value.trim() };
    });
  };

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

  const handleImageChange = (e) => {
    setUpdateUserSuccess(null);
    const file = e.target.files[0];

    var file_type = file.type;
    file_type = file_type.toLowerCase();
    file_type = file_type.substr(0, file_type.indexOf("/"));

    setImageFileUploadProgress(null);
    setImageFileUploadError(null);

    if (file && file_type === "image") {
      setImageFileUrl(URL.createObjectURL(file));
      uploadImage(e.target.files[0]);
    } else if (file_type !== "image") {
      setImageFileUploadError("Please upload a image file.");
    }
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile is updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const uploadImage = async (file) => {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '_' + file.name;
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
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploadError(null);
          setImageFileUploadProgress(null);
          setImageFileUploading(false);
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
                imageFileUploadingProgress <= 100 &&
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
            defaultValue={currentUser.username}
            spellCheck={false}
            onChange={handleChange}
            className="w-full h-10 border-2 border-black/40 rounded-md px-4 py-2 outline-blue-700"
          />
          <input
            type="text"
            name="email"
            defaultValue={currentUser.email}
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
            className={`border-none outline-none w-full h-10 font-semibold rounded-lg
            bg-gradient-to-r from-cyan-500 to-purple-500 text-white p-[2px] px-[3px] ${
              imageFileUploading || loading ? "cursor-not-allowed" : ""
            }`}
            type="submit"
          >
            <div className="w-full h-full rounded-md bg-white text-black flex items-center justify-center hover:bg-transparent hover:text-white">
              {imageFileUploading || loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="h-7 w-7" />
                  <span>Loading...</span>
                </div>
              ) : (
                "Update"
              )}
            </div>
          </button>
          {currentUser.isAdmin && (
            <Link
              to={"/create-post"}
              className="border-none outline-none w-full h-10 font-semibold rounded-lg
              bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
            >
              <span className="w-full h-full rounded-md flex items-center justify-center">
                Create a Post
              </span>
            </Link>
          )}
        </form>
        <div className="mt-5 flex justify-between text-red-500 font-semibold">
          <span className="cursor-pointer" onClick={() => setShowModal(true)}>
            Delete Account
          </span>
          <span className="cursor-pointer" onClick={handleSignOut}>
            Sign out
          </span>
        </div>
        {updateUserSuccess && (
          <div className="text-center mt-5 bg-[#def7ec] p-2 rounded-md select-text max-w-lg w-full">
            {updateUserSuccess}
          </div>
        )}
        {showModal && (
          <DeletePopup
            setShowModal={setShowModal}
            handleDelete={handleDeleteUser}
          />
        )}
      </div>
    </div>
  );
}
