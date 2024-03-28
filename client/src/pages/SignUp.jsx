import { useState } from "react";
import Input from "../components/Input";
import { Link } from "react-router-dom";

export default function SignUp() {

  const [formDetails, setFormDetails] = useState({
    username: "",
    email: "",
    password: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div className="min-h-screen flex justify-center items-center select-none">
      <div className="flex flex-col items-center p-3">
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
            errorMessage="Email a valid email"
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
          <button className="w-full h-12 bg-red-500 mt-2 rounded-xl
            bg-gradient-to-r from-indigo-500 via-purple-500
            to-pink-500
          ">
            Submit
          </button>
          <div className="flex gap-1 justify-center text-md">
            <span className="text-black">Already have an account?</span>
            <Link to="/sign-in"
              className="underline underline-offset-2 text-blue-700"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
