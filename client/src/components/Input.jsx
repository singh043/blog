/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import PropTypes from "prop-types";
import { useState } from "react";
import "./Input.css";

const Input = ({ label, pattern, formDetails, setFormDetails, type, name, errorMessage, id }) => {   
    
    const [focused, setFocused] = useState(false);
  
    const handleFocus = () => {
      setFocused(true);
    };
  

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormDetails((prev) => {
            return { ...prev, [name]: value.trim() }
        })
    }

    const togglePasswordVisibility = () => {
        const passwordInput = document.getElementById('password');
        console.log(passwordInput)
        const showHide = document.getElementById('toggleShowPass');
        if(passwordInput.type === "password") {
            passwordInput.type = "text";
            showHide.innerHTML = "hide";
        }else {
            passwordInput.type = "password"
            showHide.innerHTML = "show"
        }
      }

    return (
        <div className="relative z-0 flex flex-col gap-1">
            <input 
                type={type}
                id={id}
                name={name}
                placeholder=""
                spellCheck={false}
                onChange={handleChange}
                required={true}
                onBlur={handleFocus}
                pattern={pattern}
                // onFocus={() => setFocused(false)}
                focused={focused.toString()}
                className="input w-full rounded-lg h-14 peer transition pt-4 px-3 border-[2px] border-black/60 focus:outline-2 focus:outline-blue-700"
            />
            <label
                className={`text-gray-500 absolute left-3 top-3.5 pointer-events-none 
                    duration-150 transform -translate-y-0 origin-[0] peer-focus:-translate-y-3 peer-focus:scale-75 text-lg peer-focus:text-black
                    ${formDetails[name].length > 0 ? "-translate-y-[12px] scale-75 text-black/95" : "" }
                `}
            >
                {label}
            </label>
            { name === "password" && (<span
              id="toggleShowPass"
              className='absolute flex items-center justify-center right-2 top-[14px] text-[16px] cursor-pointer text-c2 font-semibold hover:bg-c2/30 p-0.5 px-2 rounded-full'
              onClick={() => togglePasswordVisibility()}
            >show</span>) }
            <span className="text-red-600 hidden error">{errorMessage}</span>
        </div>
    )
}

Input.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    pattern: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    formDetails: PropTypes.object,
    setFormDetails: PropTypes.func,
    errorMessage: PropTypes.string,
}

export default Input;