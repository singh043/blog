import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DeletePopup from "./DeletePopup";

const DashPosts = () => {

    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
                const data = await res.json();
                if (res.ok) {
                    setUserPosts(data.posts);
                    if(data.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        if(currentUser.isAdmin) {
            fetchPosts();
        }
    //eslint-disable-next-line
    }, [currentUser._id])
 
    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
            const data = await res.json();
            if(res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts])
                if(data.posts.length < 9){
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete))
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="overflow-auto md:mx-auto p-3 w-full">
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <div className="rounded-lg shadow overflow-auto hidden md:block scrollbar-thin">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200 font-semibold 
                                text-md">
                                <tr>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide whitespace-nowrap w-32">Date updated</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide whitespace-nowrap w-32">Post image</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide">Post title</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide w-36">Category</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide w-32">Delete</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide w-32">Edit</th>
                                </tr>
                            </thead>
                            {userPosts.map((post) => (
                                <tbody key={post._id} className="text-gray-500 text-center">
                                    <tr className="border-b-[1px]">
                                        <td className="border-r-[1px] p-3 text-sm whitespace-nowrap 
                                            text-gray-500">{new Date(post.updatedAt).toLocaleDateString()}</td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700 
                                            
                                                whitespace-nowrap">
                                            <Link to={`/post/${post.slug}`}>
                                                <img src={post.image} alt={post.title} 
                                                    className="w-24 h-12 object-cover rounded-sm" 
                                                />
                                            </Link>
                                        </td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700 
                                            whitespace-nowrap text-left">
                                            <Link to={`/post/${post.slug}`}
                                                className="font-medium text-gray-900 dark:text-white"
                                            >{post.title}</Link>
                                        </td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700">
                                            <div className="rounded-[6px] bg-opacity-40 py-1 px-1.5 
                                                text-sm font-medium tracking-wider text-teal-500 bg-green-200">
                                                {post.category}
                                            </div>
                                        </td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700 
                                            whitespace-nowrap">
                                            <span className="font-medium text-red-500 
                                                hover:underline cursor-pointer"
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setPostIdToDelete(post._id);
                                                }}
                                            >
                                                Delete
                                            </span></td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700 
                                            whitespace-nowrap">
                                            <Link to={`/update-post/${post._id}`} 
                                                className="text-teal-500 hover:underline">
                                                <span>Edit</span>
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                    {
                        userPosts.map((post) => (
                                <div className="bg-white p-4 rounded-lg shadow space-y-3" key={post._id}>
                                    <div className="flex items-center space-x-2 justify-between 
                                        text-sm">
                                        <div className="text-gray-500">{new Date(post.updatedAt).
                                            toLocaleDateString()}
                                        </div>
                                        <div className="rounded-lg bg-opacity-40 py-1 px-1.5 text-sm 
                                            font-medium tracking-wider text-teal-500 bg-green-200">{post.category}
                                        </div>
                                    </div>
                                    <div className="text-blue-500 font-semibold"><Link to={`/post/${post.slug}`}>{post.title}</Link></div>
                                    <div>
                                        <Link to={`/post/${post.slug}`}>
                                            <img src={post.image} alt={post.title} 
                                                className="w-full h-48 object-cover rounded-md" 
                                            />
                                        </Link>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-red-500 font-semibold hover:underline 
                                            cursor-pointer"
                                            onClick={() => {
                                                setShowModal(true);
                                                setPostIdToDelete(post._id);
                                            }}
                                        >Delete</span>
                                        <span className="text-teal-500 font-semibold hover:underline 
                                            cursor-pointer">
                                                <Link to={`/update-post/${post._id}`}>
                                                    Edit
                                                </Link>
                                        </span>
                                    </div>
                                </div>
                        ))
                    }
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
                            title="Are you sure, you want to delete this post?"
                            handleDeleteUser={handleDeletePost}
                        />
                    )}
                </>
            ) : <p>You have no posts yet</p>}
        </div>
    )
}

export default DashPosts;