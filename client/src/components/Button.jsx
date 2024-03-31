/* eslint-disable react/prop-types */

const Button = ({ onClick, className, icon, label }) => {
  return (
    <div
      onClick={onClick}
      className={` rounded-xl border-2 border-black/25 p-2 w-10 h-10 flex 
        items-center justify-center cursor-pointer ${className} `}
    >
      {icon || label}
    </div>
  );
};

export default Button;
