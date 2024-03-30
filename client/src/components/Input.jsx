/* eslint-disable react/no-unknown-property */
import PropTypes from "prop-types";
import { useState } from "react";
import "./Input.css";

const Input = ({ label, pattern, formDetails, setFormDetails, type, name, errorMessage }) => {   
    
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

    return (
        <div className="relative z-0 flex flex-col gap-1">
            <input 
                type={type}
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
            <span className="text-red-600 hidden error">{errorMessage}</span>
        </div>
    )
}

Input.propTypes = {
    name: PropTypes.string,
    pattern: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    formDetails: PropTypes.object,
    setFormDetails: PropTypes.func,
    errorMessage: PropTypes.string,
}

export default Input;