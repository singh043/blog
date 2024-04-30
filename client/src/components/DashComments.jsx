import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import DeletePopup from "./DeletePopup";

const DashComments = () => {

    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState('');
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`);
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    if(data.comments.length <= 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        if(currentUser.isAdmin) {
            fetchComments();
        }
    //eslint-disable-next-line
    }, [currentUser._id])
 
    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`)
            const data = await res.json();
            if(res.ok) {
                setComments((prev) => [...prev, ...data.comments])
                if(data.comments.length <= 9){
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteComment = async () => {
        try {
            const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
                setShowModal(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="overflow-auto md:mx-auto p-3 w-full">
            {currentUser.isAdmin && comments.length > 0 ? (
                <>
                    <div className="rounded-lg shadow overflow-auto scrollbar-thin">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200 font-semibold 
                                text-md">
                                <tr>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide whitespace-nowrap">Date updated</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide whitespace-nowrap">Comment content</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide">Number of Likes</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide">PostId</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide">UserId</th>
                                    <th className="border-r-[1px] text-center p-3 font-semibold 
                                        tracking-wide">Delete</th>
                                </tr>
                            </thead>
                            {comments.map((comment) => (
                                <tbody key={comment._id} className="text-gray-500 text-center">
                                    <tr className="border-b-[1px]">
                                        <td className="border-r-[1px] p-3 text-sm whitespace-nowrap 
                                            text-gray-500">{new Date(comment.updatedAt).toLocaleDateString()}</td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700 
                                            whitespace-nowrap flex justify-center">
                                            {comment.content}
                                        </td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700 
                                            whitespace-nowrap">
                                            {comment.numberOfLikes}
                                        </td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700 
                                            whitespace-nowrap">
                                            {comment.postId}
                                        </td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700 
                                            whitespace-nowrap">
                                            {comment.userId}
                                        </td>
                                        <td className="border-r-[1px] p-3 text-sm text-gray-700 
                                            whitespace-nowrap">
                                            <span className="font-medium text-red-500 
                                                hover:underline cursor-pointer"
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setCommentIdToDelete(comment._id);
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
                            title="Are you sure, you want to delete this comment?"
                            handleDelete={handleDeleteComment}
                        />
                    )}
                </>
            ) : <p>You have no comments yet</p>}
        </div>
    )
}

export default DashComments;