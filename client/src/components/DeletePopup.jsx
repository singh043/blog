import { RiErrorWarningLine } from "react-icons/ri";

const DeletePopup = (props) => {
  return (
    <div className="h-full w-full fixed top-0 left-0 z-20 flex justify-center items-center select-none">
      <div
        className="w-full h-full absolute glass-effect"
        onClick={() => props.setShowModal(false)}
      ></div>
      <div className="relative w-[500px] box-shadow bg-white rounded-3xl z-10 flex flex-col">
        <div className="mt-8 mb-5">
          <div className="flex items-center justify-center gap-3">
            <RiErrorWarningLine size={24} className="text-red-500" />
            <div className="text-lg">
              { props.title ? props.title : "Are you sure, you want to delete this account?"}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-5">
            <button
              onClick={props.handleDeleteUser}
              className="border-[2px] border-red-700 py-2 px-4
                    text-sm rounded-md text-red-500 hover:bg-red-700 hover:text-white"
            >
              Confirm
            </button>
            <button
              onClick={() => props.setShowModal(false)}
              className="border-[2px] border-black py-2 px-4
                    text-sm rounded-md text-black hover:bg-blue-500 hover:text-white hover:border-blue-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
