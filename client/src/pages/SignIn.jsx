/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure, resetError } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {

  const [formDetails, setFormDetails] = useState({
    email: "",
    password: ""
  })

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(resetError());
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDetails),
      })

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message))
      }
      if(res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center select-none">
      <div className="flex flex-col items-center py-10 px-8 box-shadow rounded-lg ">
        <div className="self-start text-3xl font-semibold">
          Sign in
        </div>
        <form className="flex flex-col w-[400px] gap-4 mt-5" onSubmit={handleSubmit}>
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
              ) : <span className="font-semibold text-lg">Sign in</span> }
          </button>
          <OAuth />
        </form>
        <div className="flex gap-1 justify-center text-md mt-5">
          <span className="text-black">New to Flick&apos;s Blog?</span>
          <Link to="/sign-up"
            className="underline underline-offset-2 text-blue-700"
          >
            Sign Up
          </Link>
        </div>
        {
          errorMessage && (
            <div className="text-center mt-5 bg-red-300 p-2 rounded-md select-text w-[400px] ">
              {errorMessage}
            </div>
          )
        }
      </div>
    </div>
  )
}
