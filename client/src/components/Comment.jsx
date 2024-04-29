import dayjs from 'dayjs';
import { FaThumbsUp } from 'react-icons/fa';
import { useEffect, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from 'react-redux';

const Comment = ({ comment, onLike, onEdit }) => {

    dayjs.extend(relativeTime);
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser();
    }, [comment])

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    }

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: editedContent
                })
            })

            if (res.ok) {
                setIsEditing(false);
                onEdit(comment, editedContent);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex p-4 border-b dark:border-gray-600 text-sm">
            <div className="flex-shrink-0 mr-3">
                <img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className="font-bold mr-1 text-xs truncate">
                        {user ? '@{user.username}' : 'anonymous user'}
                    </span>
                    <span className="text-gray-500 text-xs">
                        { dayjs(comment.createdAt).fromNow()}
                    </span>
                </div>
                {
                    isEditing ? (
                        <>
                            <textarea 
                                placeholder='Add a comment...'
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className='w-full mb-2 border-[2px] p-2 rounded-lg bg-gray-50 outline-blue-700'
                            />
                            <div className="flex justify-end gap-2 text-sm">
                                <button type='button' className='border-none outline-none font-semibold rounded-md bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-3 py-1'
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                                <button type='button' className='border-[1px] rounded-md border-black px-2 py-1'
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-500 pb-2">{comment.content} { comment.edited ? "( edited )" : null} </p>
                            <div className="flex items-center pt-2 text-xs gap-2 border-t dark:border-gray-700 max-w-fit">
                                <button type='button' className={`text-gray-400 hover:text-blue-500
                                    ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}
                                    onClick={() => onLike(comment._id)}
                                >
                                    <FaThumbsUp className='text-sm' />
                                </button>
                                <p className='text-gray-400'>{comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (
                                    comment.numberOfLikes === 1 ? "like" : "likes"
                                )}</p>
                                {
                                    currentUser && ( currentUser._id === comment.userId || currentUser.isAdmin ) && (
                                        <button type='button' className='text-gray-400 hover:text-blue-500'
                                            onClick={handleEdit}
                                        >
                                            Edit
                                        </button>
                                    )
                                }
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default Comment;