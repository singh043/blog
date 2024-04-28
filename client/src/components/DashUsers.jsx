import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import DeletePopup from "./DeletePopup";
import { FaCheck, FaTimes } from 'react-icons/fa';

const DashUsers = () => {

    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    if(data.users.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        if(currentUser.isAdmin) {
            fetchUsers();
        }
    //eslint-disable-next-line
    }, [currentUser._id])
 
    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`)
            const data = await res.json();
            if(res.ok) {
                setUsers((prev) => [...prev, ...data.users])
                if(data.users.length < 9){
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
              method: "DELETE",
            });
            const data = await res.json();
            if (res.ok) {
              setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
              setShowModal(false);
            } else {
              console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="overflow-auto md:mx-auto p-3 w-full">
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <div className="rounded-lg shadow overflow-auto scrollbar-thin">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200 font-semibold 
                                text-md">
                                <tr>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide whitespace-nowrap">Date created</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide whitespace-nowrap">User image</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide">Username</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide">Email</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide">Admin</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide">Delete</th>
                                </tr>
                            </thead>
                            {users.map((user) => (
                                <tbody key={user._id} className="text-gray-500 text-center">
                                    <tr className="border-b-[1px]">
                                        <td className="border-r-[1px] p-3 text-sm whitespace-nowrap 
                                            text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700 
                                            whitespace-nowrap flex justify-center">
                                            <img src={user.profilePicture} alt={user.userName} 
                                                className="w-12 h-12 object-cover rounded-full" 
                                            />
                                        </td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700 
                                            whitespace-nowrap">
                                            {user.username}
                                        </td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700 
                                            whitespace-nowrap">
                                            {user.email}
                                        </td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700 
                                            whitespace-nowrap">
                                            <div className="flex items-center justify-center">
                                                {user.isAdmin ? (<FaCheck className="text-green-500" />) : (<FaTimes className="text-red-500" />)}
                                            </div>
                                        </td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700 
                                            whitespace-nowrap">
                                            <span className="font-medium text-red-500 
                                                hover:underline cursor-pointer"
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setUserIdToDelete(user._id);
                                                }}
                                            >
                                                Delete
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                    {
                        showMore && (
                            <button className="w-full text-teal-500 self-center text-sm py-7
                                cursor-pointer"
                                onClick={handleShowMore}
                            >
                                Show more
                            </button>
                        )
                    }
                    {showModal && (
                        <DeletePopup
                            setShowModal={setShowModal}
                            title="Are you sure, you want to delete this user?"
                            handleDeleteUser={handleDeleteUser}
                        />
                    )}
                </>
            ) : <p>You have no users yet</p>}
        </div>
    )
}

export default DashUsers;