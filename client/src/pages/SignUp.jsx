/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import OAuth from "../components/OAuth";
import { resetError } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function SignUp() {

  const [formDetails, setFormDetails] = useState({
    username: "",
    email: "",
    password: ""
  })

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    dispatch(resetError());
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDetails),
      })

      const data = await res.json();
      if (data.success === false) {
        if(data.message === `E11000 duplicate key error collection: blog.users index: username_1 dup key: { username: "${formDetails.username}" }`)
          setErrorMessage("This username is already in use.");
        else if(data.message === `E11000 duplicate key error collection: blog.users index: email_1 dup key: { email: "${formDetails.email}" }`)
          setErrorMessage("This email id is already in use.");
        else setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center select-none">
      <div className="flex flex-col items-center py-10 px-8 box-shadow rounded-lg ">
        <div className="text-center text-3xl font-semibold">
          Create New Account
        </div>
        <form className="flex flex-col w-[400px] gap-4 mt-5" onSubmit={handleSubmit}>
          <Input 
            id="username"
            label={"Username"}
            name="username"
            type="text"
            errorMessage="Enter valid username with minimum 4 characters and no special characters"
            pattern="^[A-za-z0-9]{4,16}$"
            formDetails={formDetails}
            setFormDetails={setFormDetails}
          />
          <Input 
            id="email"
            label={"Email"}
            name="email"
            type="email"
            errorMessage="Enter a valid email"
            // pattern="/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/"
            formDetails={formDetails}
            setFormDetails={setFormDetails}
          />
          <Input 
            id="password"
            label={"Password"}
            name="password"
            type="password"
            pattern="^[A-za-z0-9 ]{8,}$"
            errorMessage="Password must contain minimum 8 characters"
            formDetails={formDetails}
            setFormDetails={setFormDetails}
          />
          <button className={`w-full h-12 bg-red-500 mt-2 rounded-xl
            bg-gradient-to-r from-indigo-500 via-purple-500
            to-pink-500 border-none outline-none text-white ${loading ? "cursor-not-allowed" : ""}`}
             disabled={loading}
          >
            { loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner className="h-7 w-7" />
                <span>Loading...</span>
              </div>
              ) : <span className="font-semibold text-lg">Sign up</span> }
          </button>
          <OAuth />
        </form>
        <div className="flex gap-1 justify-center text-md mt-5">
          <span className="text-black">Already have an account?</span>
          <Link to="/sign-in"
            className="underline underline-offset-2 text-blue-700"
          >
            Sign in
          </Link>
        </div>
        {
          errorMessage && (
            <div className="text-center mt-5 bg-red-300 p-2 rounded-md select-text w-[400px]">
              {errorMessage}
            </div>
          )
        }
      </div>
    </div>
  )
}
