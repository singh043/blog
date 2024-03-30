/* eslint-disable react/prop-types */
const Avatar = ({user, size, onClick}) => {

    const s = size === "small" ? 32 : size === "medium" ? 36 : size === "x-large"
        ? 56 : size === "xx-large" ? 96 : 40;

    const c = size === "small" ? "w-8 h-8" : size === "medium" ? "w-9 h-9" :
        size === "large" ? "w-10 h-10" : size === "x-large" ? "w-14 h-14" :
        "w-24 h-24";

    return (
        <div className={`${c} text-base rounded-full flex items-center justify-center
            shrink-0 overflow-hidden cursor-pointer`}
            style={{backgroundColor: user?.color}}
            onClick={onClick}
        >
            <img 
                src={user?.profilePicture}
                alt='User Avatar'
                width={s}
                height={s}
                className=''
            />
        </div>
    )
}

export default Avatar;